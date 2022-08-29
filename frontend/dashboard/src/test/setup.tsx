import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'whatwg-fetch';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom/extend-expect';
import 'mutationobserver-shim';
import { server } from './server';

jest.setTimeout(10000);

// Mock call to import.meta.ENV
jest.mock('utils/getEnv', () => ({
  getNodeEnv: () => 'testing',
}));

// Mock API endpoint
jest.mock('utils/getApiEndpoint', () => ({
  getApiEndpoint: () => 'http://localhost:4000/graphql',
}));

// Mock react-lottie
jest.mock('react-lottie', () => () => <div>Lottie</div>);

// Setup MSW listener
beforeAll(() => {
  server.listen();
  // @ts-ignore

  // Delet resizeobserver (used to cancel out SVG resizes)
  delete window.ResizeObserver;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

// Reset all server handlers
afterEach(() => server.resetHandlers());

// Close MSW listener
afterAll(() => {
  server.close();

  // Reset resizeobserver (used to cancel out SVG resizes)
  window.ResizeObserver = ResizeObserver;
  jest.restoreAllMocks();
});

export default {};

