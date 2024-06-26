module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^axios$": "axios/dist/node/axios.cjs",
    "^query-string$": "query-string/index.js",
  },
  transformIgnorePatterns: ["node_modules/(?!(axios|query-string)/)"],
};
