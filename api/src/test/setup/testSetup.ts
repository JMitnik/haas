// Mock dependency module
// @ts-ignore
jest.mock('test/setup/singletonDeps', () => global.singletonDepsModule);
jest.setTimeout(30000);