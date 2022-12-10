import * as crypto from "crypto";

import { verify_number_theoretic_input } from "../number_theory/input_verification";

const TWO_TO_32 = 2 ** 32;

// This is a good known integer RNG algorithm.
// It returns 32 bit outputs so we will always have to call it twice to get
// 64 bit random numbers, same as Math.random()
// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316
function jsf32(a: number, b: number, c: number, d: number): () => number {
  return function (): number {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    const t = (a - ((b << 27) | (b >>> 5))) | 0;
    a = b ^ ((c << 17) | (c >>> 15));
    b = (c + d) | 0;
    c = (d + t) | 0;
    d = (a + t) | 0;
    return d >>> 0;
  };
}

// A reproducible random number generator
export class SeededRng {
  // We do not keep the seed as a variable - no need to, and this
  // also make this RNG usable in cryptographic applications.
  // *WAS NOT TESTED FOR CRYPTOGRAPHIC SECURITY*
  private _32bit_rng_callback: () => number;

  constructor(seed: string) {
    const hashed_seed = crypto.createHash("sha1").update(seed).digest("hex");
    const seed_p1 = parseInt(hashed_seed.slice(0, 8), 16);
    const seed_p2 = parseInt(hashed_seed.slice(8, 16), 16);
    const seed_p3 = parseInt(hashed_seed.slice(16, 24), 16);
    const seed_p4 = parseInt(hashed_seed.slice(24, 32), 16);
    this._32bit_rng_callback = jsf32(seed_p1, seed_p2, seed_p3, seed_p4);
  }

  /**
   * Protected to prevent accidental use
   * @protected
   */
  public get_random_32bit_int(): number {
    return this._32bit_rng_callback();
  }

  /**
   * Similar to Math.random()
   */
  public get_random_64bit_float(): number {
    const small_part = this._32bit_rng_callback();
    const large_part = this._32bit_rng_callback();
    return small_part / TWO_TO_32 ** 2 + large_part / TWO_TO_32;
  }

  /**
   * Returns a number from [0..(max-1)]
   * @param max - excluded max
   */
  public get_random_int(max: number): number {
    verify_number_theoretic_input(max);
    return Math.floor((this._32bit_rng_callback() / TWO_TO_32) * max);
  }
}
