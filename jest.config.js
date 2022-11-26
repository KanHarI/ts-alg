"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    clearMocks: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
};
//# sourceMappingURL=jest.config.js.map