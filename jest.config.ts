import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  reporters: ["default", "jest-junit"],
  coverageDirectory: "./coverage/",
  collectCoverage: true,
  setupFilesAfterEnv: ["./setupTests.ts"],
};
export default config;
