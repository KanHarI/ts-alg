import { range } from "lodash";

import { PRIMES_UP_TO_100 } from "../src/number_theory/primes";
import { SeededRng } from "../src/seeded_rng/SeededRng";

const NUM_CHECKS_SANITY = 100;
const NUM_CHECKS_UTILITY_FLOAT = 10_000;
const NUM_CHECKS_MODULU = 100_000;

// Fail approximately 1/1000 times (two-sided distribution)
const P_VALUE_MIN_FOR_TESTS = 0.0005;

abstract class Distribution {
  private _cached_utiity?: number;
  private _cached_variance?: number;

  public utility(): number {
    if (this._cached_utiity === undefined) {
      this._cached_utiity = this._utility();
    }
    return this._cached_utiity;
  }
  public variance(): number {
    if (this._cached_variance === undefined) {
      this._cached_variance = this._variance();
    }
    return this._cached_variance;
  }

  protected abstract _utility(): number;
  protected abstract _variance(): number;
}

class FloatRange extends Distribution {
  public _min: number;
  public _max: number;
  constructor(max = 1, min = 0) {
    super();
    this._min = min;
    this._max = max;
  }

  protected _utility(): number {
    return (this._max + this._min) / 2;
  }

  protected _variance(): number {
    // Symmetrical
    return (this._max - this.utility()) ** 2 / 12;
  }
}

class EnumeratedDistribution extends Distribution {
  public _weighed_values: Record<number, number>;

  constructor(weighted_values: Record<number, number>) {
    super();
    this._weighed_values = weighted_values;
  }

  protected _utility(): number {
    let utility = 0;
    for (const num_str of Object.keys(this._weighed_values)) {
      const num = Number(num_str);
      utility += num * (this._weighed_values[num] ?? 0);
    }
    return utility;
  }

  protected _variance(): number {
    const utility = this.utility();
    let variance = 0;
    for (const num_str of Object.keys(this._weighed_values)) {
      const num = Number(num_str);
      variance += (num - utility) ** 2 * (this._weighed_values[num] ?? 0);
    }
    return variance;
  }
}

function gaussian_z_score(
  sum: number,
  n: number,
  distribution: Distribution
): number {
  expect(n).toBeGreaterThan(1);
  const approximate_std = Math.sqrt(distribution.variance() / (n - 1));
  return (sum / n - distribution.utility()) / approximate_std;
}

//stackoverflow.com/questions/16194730/seeking-a-statistical-javascript-function-to-return-p-value-from-a-z-score
function approximate_z_score_to_p_value(z: number): number {
  //z == number of standard deviations from the mean

  //if z is greater than 6.5 standard deviations from the mean
  //the number of significant digits will be outside of a reasonable
  //range
  if (z < -6.5) return 0.0;
  if (z > 6.5) return 1.0;

  if (z > 0) {
    z = -z;
  }

  let factK = 1;
  let sum = 0;
  let term = 1;
  let k = 0;
  const loopStop = Math.exp(-23);
  while (Math.abs(term) > loopStop) {
    term =
      (((0.3989422804 * Math.pow(-1, k) * Math.pow(z, k)) /
        (2 * k + 1) /
        Math.pow(2, k)) *
        Math.pow(z, k + 1)) /
      factK;
    sum += term;
    k++;
    factK *= k;
  }
  sum += 0.5;

  return 2 * sum;
}

function approximate_gaussian_percentile(
  sum: number,
  n: number,
  distribution: Distribution
): number {
  const z_score = gaussian_z_score(sum, n, distribution);
  return approximate_z_score_to_p_value(z_score);
}

describe("random-sanity", () => {
  it("random-int-sanity", () => {
    const reproducible_rng = new SeededRng("TEST_SEED");
    for (let i = 0; i < NUM_CHECKS_SANITY; ++i) {
      const random_num = reproducible_rng.get_random_int(10);
      expect(random_num).toBeGreaterThanOrEqual(0);
      expect(random_num).toBeLessThan(10);
    }
  });

  it("Random float utility", () => {
    const seed = "TEST_SEED";
    const reproducible_rng = new SeededRng(seed);
    let sum = 0;
    // eslint-disable-next-line no-unused-vars
    for (const _ of range(NUM_CHECKS_UTILITY_FLOAT)) {
      sum += reproducible_rng.get_random_64bit_float();
    }
    const p_value = approximate_gaussian_percentile(
      sum,
      NUM_CHECKS_UTILITY_FLOAT,
      new FloatRange()
    );
    expect(p_value).toBeGreaterThan(P_VALUE_MIN_FOR_TESTS);
    expect(p_value).toBeLessThan(1 - P_VALUE_MIN_FOR_TESTS);
  });

  // Test that the utility of random ints modulu some primes is distributed
  // as expected (uniformly)
  it("Random modulu some primes", () => {
    const seed = "TEST_SEED";
    const reproducible_rng = new SeededRng(seed);
    for (const prime of PRIMES_UP_TO_100) {
      const expected_distribution = new EnumeratedDistribution({
        0: (prime - 1) / prime,
        1: 1 / prime,
      });
      const equivalence_classes: Array<number> = Array.from(range(prime)).map(
        // eslint-disable-next-line no-unused-vars
        (_) => 0
      );

      // eslint-disable-next-line no-unused-vars
      for (const _ of range(NUM_CHECKS_MODULU)) {
        const next_output = reproducible_rng.get_random_32bit_int();
        equivalence_classes[next_output % prime]++;
      }
      for (const equivalence_class_cardinality of equivalence_classes) {
        const p_value = approximate_gaussian_percentile(
          equivalence_class_cardinality,
          NUM_CHECKS_MODULU,
          expected_distribution
        );
        // for the P value - we have to split the error between all the primes
        // to fail once 1/P_MIN times, and split every prime into the
        // number of equivalence classes modulu it
        expect(p_value).toBeGreaterThan(
          P_VALUE_MIN_FOR_TESTS / (PRIMES_UP_TO_100.length * prime)
        );
        expect(p_value).toBeLessThan(
          1 - P_VALUE_MIN_FOR_TESTS / (PRIMES_UP_TO_100.length * prime)
        );
      }
    }
  });
});
