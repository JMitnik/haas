// eslint-disable-next-line import/no-extraneous-dependencies
import 'whatwg-fetch';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom/extend-expect';
import { server } from './server';

// Mock call to import.meta.ENV
jest.mock('utils/getEnv', () => ({
  getNodeEnv: () => 'testing',
}));

// Mock API endpoint
jest.mock('utils/getApiEndpoint', () => ({
  getApiEndpoint: () => 'http://localhost:4999/graphql',
}));

// Setup MSW listener
beforeAll(() => server.listen());

// Reset all server handlers
afterEach(() => server.resetHandlers());

// Close MSW listener
afterAll(() => server.close());

export default {};
