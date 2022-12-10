import { verify_number_theoretic_input } from "./input_verification";
import { factorize } from "./primes";

function _sigma(n: number): number {
  let result = 1;
  const factorized = factorize(n);
  for (const prime_str of Object.keys(factorized)) {
    const prime = Number(prime_str);
    const denominator = prime - 1;
    const power = factorized[prime] ?? 1;
    if (power == 1) {
      result *= (prime ** 2 - 1) / denominator;
      continue;
    }
    const nuerator = prime ** (power + 1) - 1;
    result *= nuerator / denominator;
  }
  return result;
}

/**
 * Find the sum of divisors of a number
 * @param n
 */
export function sigma(n: number): number {
  verify_number_theoretic_input(n);
  return _sigma(n);
}

/**
 * Sum of proper divisors of a number
 * @param n
 */
export function d(n: number): number {
  return sigma(n) - n;
}
