module.exports = {
  bail: 1,

  clearMocks: true,

  collectCoverage: true,

  collectCoverageFrom: ["**/src/services/**/*.js"],

  coveragePathIgnorePatterns: [
    "/node_modules/",
  ],

  coverageReporters: ["text", "text-summary", "lcov"],

  resetMocks: true,

  testEnvironment: "node",

  verbose: true,
};
