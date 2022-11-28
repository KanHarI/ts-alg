import { performance } from "perf_hooks";

import {
  factorize,
  is_prime,
  populate_primes_up_to,
  PRIMES_UP_TO_100,
  reset_primes_population,
} from "../src/number_theory/primes";
import { d } from "../src/number_theory/sigma";

const MERSENNE_PRIMES = [2, 3, 5, 7, 13];

const AMICABLE_NUMBERS: Array<[number, number]> = [
  [220, 284],
  [17_296, 18_416],
];

describe("Number theory module tests", () => {
  it("Check primes to 100", () => {
    for (let i = 0; i < 100; ++i) {
      expect(PRIMES_UP_TO_100.includes(i)).toBe(is_prime(i));
    }
  });

  it("Factorization tests", () => {
    expect(factorize(3)).toStrictEqual({ "3": 1 });
    expect(factorize(49)).toStrictEqual({ "7": 2 });
    expect(factorize(98)).toStrictEqual({ "2": 1, "7": 2 });
  });

  // A perfect number is a number equal to it's sum of divisors
  it("Perfect numbers test", () => {
    // All even perfect numbers are of the form
    // 2^(p - 1) * (2^p - 1)
    // Were p is a mersenne prime
    const perfect_numbers = MERSENNE_PRIMES.map(
      (mersenne_prime) => 2 ** (mersenne_prime - 1) * (2 ** mersenne_prime - 1)
    );
    expect(perfect_numbers.includes(6)).toBe(true);
    expect(perfect_numbers.includes(28)).toBe(true);
    expect(perfect_numbers.includes(9)).toBe(false);
    expect(Math.max(...perfect_numbers)).toBeGreaterThan(100_000);
    for (const perfect_number of perfect_numbers) {
      expect(d(perfect_number)).toBe(perfect_number);
    }
  });

  // Amicable numbers are a pair of numbers, each of which is the sum of the
  // proper divisors of the other
  it("Amicable numbers", () => {
    for (const [n1, n2] of AMICABLE_NUMBERS) {
      expect(d(n1)).toBe(n2);
      expect(d(n2)).toBe(n1);
    }
  });

  it("Populate primes performance", () => {
    reset_primes_population();
    const t_0 = performance.now();
    populate_primes_up_to(100_000);
    const t_1 = performance.now();
    expect(t_1 - t_0).toBeLessThan(200);
    reset_primes_population();
    const t_2 = performance.now();
    populate_primes_up_to(1_000_000);
    const t_3 = performance.now();
    expect(t_3 - t_2).toBeLessThan(2000);
  });
});
