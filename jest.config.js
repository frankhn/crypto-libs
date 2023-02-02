module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: [
    'js',
    'ts',
    'node',
    'mts'
  ],
  coveragePathIgnorePatterns: [
    'node_modules',
    'coverage',
    'build',
  ],
  verbose: true,
  collectCoverageFrom: ['src/**/*.*'],
  testMatch: ['<rootDir>/src/__tests__/**/?(*.)+(spec|test).[tj]s?(x)'],
  passWithNoTests: true,
};
