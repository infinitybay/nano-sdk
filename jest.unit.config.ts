import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "node",
  testMatch: ["**/test/unit/**/*.test.ts"],
};

export default config;
