module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  // Ignore compiled files and frontend tests to avoid running tests from `dist` or frontend Vitest files
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/frontend/'],
  collectCoverage: false,
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
};
