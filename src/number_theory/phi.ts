import { verify_number_theoretic_input } from "./input_verification";
import { factorize } from "./primes";

function _phi(n: number): number {
  const factorization = factorize(n);
  let result = n;
  for (const prime_str of Object.keys(factorization)) {
    const prime = Number(prime_str);
    result = (result * (prime - 1)) / prime;
  }
  return result;
}

export function phi(n: number): number {
  verify_number_theoretic_input(n);
  return _phi(n);
}
