import { verify_number_theoretic_input } from "./input_verification";

let GLOBAL_PRIMES: Set<number> = new Set<number>([2]);
let PRIMES_CHECKED_UP_TO = 2;

/**
 * Exported for performance testing
 */
export function reset_primes_population() {
  GLOBAL_PRIMES = new Set<number>([2]);
  PRIMES_CHECKED_UP_TO = 2;
}

/**
 * Exported to allow for higher performance where large inputs are expected
 * @param n
 */
export function populate_primes_up_to(n: number) {
  while (PRIMES_CHECKED_UP_TO < n) {
    PRIMES_CHECKED_UP_TO++;
    const candidate_prime = PRIMES_CHECKED_UP_TO;
    const inner_max_to_check = Math.ceil(Math.sqrt(candidate_prime));
    let is_prime = true;
    // Important for runtime: iteration order equals runtime order
    for (const prime of GLOBAL_PRIMES) {
      if (candidate_prime % prime === 0) {
        is_prime = false;
        break;
      }
      if (prime > inner_max_to_check) {
        break;
      }
    }
    if (is_prime) {
      GLOBAL_PRIMES.add(candidate_prime);
    }
  }
}

function _is_prime(n: number): boolean {
  if (GLOBAL_PRIMES.has(n)) {
    return true;
  }
  if (n <= PRIMES_CHECKED_UP_TO) {
    return false;
  }
  const max_to_check = Math.ceil(Math.sqrt(n));
  populate_primes_up_to(max_to_check);

  // Now primes are checked up to sqrt n
  // Important for runtime: iteration order equals runtime order
  for (const prime of GLOBAL_PRIMES) {
    if (n % prime === 0) {
      return false;
    }
    if (prime > max_to_check) {
      break;
    }
  }
  return true;
}

/**
 * Check if a number is prime
 * @param n
 */
export function is_prime(n: number): boolean {
  verify_number_theoretic_input(n);
  return _is_prime(n);
}

function _factorize(n: number): Record<number, number> {
  let max_relevant = Math.ceil(Math.sqrt(n));
  populate_primes_up_to(max_relevant);
  const result: Record<number, number> = {};
  for (const prime of GLOBAL_PRIMES) {
    if (prime > max_relevant) {
      break;
    }
    if (n % prime === 0) {
      result[prime] = 1;
      n /= prime;
    }
    while (n % prime === 0) {
      result[prime]++;
      n /= prime;
    }
    max_relevant = Math.ceil(Math.sqrt(n));
  }
  if (n > 1) {
    result[n] = 1;
  }
  return result;
}

/**
 * Factorize a number.
 * e.g. `expect(factorize(98)).toStrictEqual({ "2": 1, "7": 2 });`
 * @param n
 */
export function factorize(n: number): Record<number, number> {
  verify_number_theoretic_input(n);
  return _factorize(n);
}

export const PRIMES_UP_TO_100 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97,
];
