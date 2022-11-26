"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const primes_1 = require("../src/number_theory/primes");
const sigma_1 = require("../src/number_theory/sigma");
const PRIMES_UP_TO_100 = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97,
];
const MERSENNE_EXPONENTS = [2, 3, 5, 7, 13];
const AMICABLE_NUMBERS = [
    [220, 284],
    [17296, 18416],
];
describe("Number theory module tests", () => {
    it("Check primes to 100", () => {
        for (let i = 0; i < 100; ++i) {
            expect(PRIMES_UP_TO_100.includes(i)).toBe((0, primes_1.is_prime)(i));
        }
    });
    it("Factorization tests", () => {
        expect((0, primes_1.factorize)(3)).toStrictEqual({ "3": 1 });
        expect((0, primes_1.factorize)(49)).toStrictEqual({ "7": 2 });
        expect((0, primes_1.factorize)(98)).toStrictEqual({ "2": 1, "7": 2 });
    });
    it("Perfect numbers test", () => {
        const perfect_numbers = MERSENNE_EXPONENTS.map((mersenne_exponent) => 2 ** (mersenne_exponent - 1) * (2 ** mersenne_exponent - 1));
        expect(perfect_numbers.includes(6)).toBe(true);
        expect(perfect_numbers.includes(28)).toBe(true);
        expect(perfect_numbers.includes(9)).toBe(false);
        expect(Math.max(...perfect_numbers)).toBeGreaterThan(100000);
        for (const perfect_number of perfect_numbers) {
            expect((0, sigma_1.d)(perfect_number)).toBe(perfect_number);
        }
    });
    it("Amicable numbers", () => {
        for (const [n1, n2] of AMICABLE_NUMBERS) {
            expect((0, sigma_1.d)(n1)).toBe(n2);
            expect((0, sigma_1.d)(n2)).toBe(n1);
        }
    });
    it("Populate primes performance", () => {
        (0, primes_1.reset_primes_population)();
        const t_0 = performance.now();
        (0, primes_1.populate_primes_up_to)(100000);
        const t_1 = performance.now();
        expect(t_1 - t_0).toBeLessThan(200);
        (0, primes_1.reset_primes_population)();
        const t_2 = performance.now();
        (0, primes_1.populate_primes_up_to)(1000000);
        const t_3 = performance.now();
        expect(t_3 - t_2).toBeLessThan(2000);
    });
});
//# sourceMappingURL=number-theory.test.js.map