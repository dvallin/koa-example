module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testRegex: '/test/integration/.*\\.spec\\.(ts?)$',
  transform: {
    '^.+\\.ts$': '<rootDir>/node_modules/ts-jest',
  },
  globalSetup: '<rootDir>/test/integration/setup.js',
  globalTeardown: '<rootDir>/test/integration/teardown.js',
}
