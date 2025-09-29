// Jest configuration for API integration tests
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/integration-test.js'],
  testTimeout: 30000,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  verbose: true,
  clearMocks: true,
};