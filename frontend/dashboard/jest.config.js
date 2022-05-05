module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['src',],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/mocks/styleMock.js',
    '\\.(svg)$': '<rootDir>/src/mocks/svgMock.ts',
    // "src/(.*)": "<rootDir>/src/$1"
  },
  modulePaths: ["node_modules", "<rootDir>/src"],
  testMatch: [
    '**/__tests__/**/*.test.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    "^.+\\.js?$": "babel-jest"
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.tsx'],
};
