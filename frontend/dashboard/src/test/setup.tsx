jest.mock('utils/getEnv', () => ({
  getNodeEnv: () => 'testing',
}));
jest.mock('utils/getApiEndpoint', () => ({
  getApiEndpoint: () => 'http://localhost:4999/graphql',
}));

export default {};
