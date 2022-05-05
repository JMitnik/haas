module.exports = {
  clearMocks: true,
  roots: ['src'],
  modulePaths: ["node_modules", "<rootDir>/src"],
  preset: 'ts-jest',
  testEnvironment: './src/test/setup/environment.ts',
  testMatch: [
    '**/__tests__/**/*.test.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./src/test/setup/testSetup.ts'],
};
