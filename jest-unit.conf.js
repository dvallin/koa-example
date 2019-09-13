module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testRegex: '/test/.*\\.spec\\.(ts?)$',
  transform: {
    '^.+\\.ts$': '<rootDir>/node_modules/ts-jest',
  },
  testPathIgnorePatterns: ['<rootDir>/integration-test/'],
}
