export const MAX_NUMBER_THEORETIC_INPUT = 1_000_000_000;

export function verify_number_theoretic_input(n: number) {
  if (
    !Number.isInteger(n) ||
    !Number.isFinite(n) ||
    n < 0 ||
    n > MAX_NUMBER_THEORETIC_INPUT
  ) {
    throw `Expected a positive integer under 1 billion for number theoretic functions! Got ${n}`;
  }
}
