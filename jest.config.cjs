module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  // Ignore compiled files to avoid running tests from `dist` when both src and dist exist
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  collectCoverage: false,
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
};
