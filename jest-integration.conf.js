module.exports = {
  moduleFileExtensions: ["js", "ts", "json"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  testRegex: "integration\-test/.*\\.spec\\.(ts?)$",
  transform: {
    "^.+\\.ts$": "<rootDir>/node_modules/ts-jest"
  }
};
