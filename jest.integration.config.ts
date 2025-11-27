import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "node",
  testMatch: ["**/test/integration/**/*.test.ts"],
  testTimeout: 30_000,
};

export default config;
