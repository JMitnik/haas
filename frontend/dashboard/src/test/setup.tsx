import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'whatwg-fetch';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom/extend-expect';
import { server } from './server';

jest.setTimeout(10000);

// Mock call to import.meta.ENV
jest.mock('utils/getEnv', () => ({
  getNodeEnv: () => 'testing',
}));

// Mock API endpoint
jest.mock('utils/getApiEndpoint', () => ({
  getApiEndpoint: () => 'http://localhost:4999/graphql',
}));

// Mock react-lottie
jest.mock("react-lottie", () => {
  return () => <div>Lottie</div>
});

// Setup MSW listener
beforeAll(() => server.listen());

// Reset all server handlers
afterEach(() => server.resetHandlers());

// Close MSW listener
afterAll(() => server.close());

export default {};
