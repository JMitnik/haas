import { GraphQLErrors } from '@apollo/client/errors';
import { handleUnauthentication } from './apollo.helpers';

let setter: jest.SpyInstance;
let getter: jest.SpyInstance;
let removeItem: jest.SpyInstance;

global.window = Object.create(window);
const url = 'https://dashboard.haas.live';
Object.defineProperty(window, 'location', {
  value: {
    href: url,
  },
});
expect(window.location.href).toEqual(url);

let cache: Record<string, string> = {};

beforeEach(() => {
  setter = jest.spyOn(global.Storage.prototype, 'setItem').mockImplementation(
    (key: string, value: string) => {
      cache[key] = value;
    },
  );

  removeItem = jest.spyOn(global.Storage.prototype, 'removeItem').mockImplementation(
    (key: string) => {
      delete cache[key];
    },
  );

  getter = jest.spyOn(global.Storage.prototype, 'getItem').mockImplementation(
    (key: string) => cache[key],
  );
});

afterEach(() => {
  cache = {};
  window.location.href = 'https://dashboard.haas.live';
  removeItem.mockRestore();
  setter.mockRestore();
  getter.mockRestore();
});

it('recognized unauthenticated error', () => {
  cache.access_token = 'test123';

  const errors: GraphQLErrors = [{
    locations: [],
    message: 'Unauthorized',
    name: 'UNAUTHENTICATED',
    nodes: [],
    originalError: undefined,
    path: undefined,
    positions: [],
    source: undefined,
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }];

  handleUnauthentication(errors);

  expect(window.location.href).toBe('/logged_out');
  expect(cache.access_token).toBe(undefined);
});

it('bad user input error does not influence access token', () => {
  cache.access_token = 'test123';

  const errors: GraphQLErrors = [{
    locations: [],
    message: 'Bad user input at field first name',
    name: 'BAD_USER_INPUT',
    nodes: [],
    originalError: undefined,
    path: undefined,
    positions: [],
    source: undefined,
    extensions: {
      code: 'BAD_USER_INPUT',
    },
  }];

  handleUnauthentication(errors);

  expect(window.location.href).toBe('https://dashboard.haas.live');
  expect(cache.access_token).toBe('test123');
});
