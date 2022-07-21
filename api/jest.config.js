module.exports = {
  testTimeout: 30000,
  projects: [
    {
      transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest",
      },
      transformIgnorePatterns: ["/node_modules/(?!(formdata-node)/)", "/bar/"],
      testEnvironment: "node",
      testPathIgnorePatterns: ["<rootDir>/node_modules/"],
      moduleFileExtensions: ["ts", "js", "node"],
      testMatch: [
        '**/__tests__/**/*.test.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)',
      ],
      roots: ['<rootDir>/src'],
    },
    // ...
  ],
}
