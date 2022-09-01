// eslint-disable-next-line import/no-extraneous-dependencies
import { setupServer } from 'msw/node';

import { defaultMockDeleteUser } from './mocks/defaults/MockDeleteUser';
import { defaultMockGetCustomerOfUserHandler } from './mocks/defaults/MockGetCustomerOfUser';

import { defaultMockMeHandler } from './mocks/defaults/MockMe';


/**
 * Defines default graphql handlers. These handlers are the standard graphql response handlers.
 *
 * For example, if `me` is being called, then the `defaultMockMeHandler` will be called, unless an override is provided
 * using `server.use(handler)`. The defaults are generally the happy path for the graphql requests, and the overrides
 * are for edge cases and errors.
 *
 * See https://kentcdodds.com/blog/stop-mocking-fetch#colocation-and-erroredge-case-testing for a good argument.
 */
const defaultHandlers = [
  defaultMockMeHandler,
  defaultMockGetCustomerOfUserHandler,
  defaultMockDeleteUser,
];

export const server = setupServer(...defaultHandlers);
