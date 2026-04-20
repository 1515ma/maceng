import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
    "^framer-motion$": "<rootDir>/tests/__mocks__/framer-motion.tsx",
    "^next-themes$": "<rootDir>/tests/__mocks__/next-themes.tsx",
    "^next/navigation$": "<rootDir>/tests/__mocks__/next-navigation.tsx",
  },
  testMatch: [
    "<rootDir>/tests/**/*.test.ts",
    "<rootDir>/tests/**/*.test.tsx",
  ],
};

export default createJestConfig(config);
