import { x } from "../src";

test("Jest sanity", () => {
  expect(7).toBe(7);
});

test("Sanity with library", () => {
  expect(x).toBe(5);
});
