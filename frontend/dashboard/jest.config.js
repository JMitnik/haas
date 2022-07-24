module.exports = {
  clearMocks: true,
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
    "^.+\\.(t|j)sx?$": "@swc/jest",
    "^.+\\.js?$": "babel-jest",
    "^.+\\.(css|scss|sass)$": "jest-preview/transforms/css",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)": "jest-preview/transforms/file"
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.tsx'],
};
