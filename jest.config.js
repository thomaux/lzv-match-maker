module.exports = {
    preset: 'ts-jest',
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.ts',
    ],
    coverageDirectory: './coverage',
    moduleFileExtensions: ['ts', 'js'],
    testEnvironment: 'node',
    testRegex: '(/test/.*spec.ts)$',
    transform: {
      '.ts': 'ts-jest',
    },
    verbose: true,
    setupFilesAfterEnv: [
        '<rootDir>/test/setup.ts',
    ]
  };
  