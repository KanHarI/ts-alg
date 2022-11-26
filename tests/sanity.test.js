"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
test("Jest sanity", () => {
    expect(7).toBe(7);
});
test("Sanity with library", () => {
    expect(src_1.x).toBe(5);
});
//# sourceMappingURL=sanity.test.js.map