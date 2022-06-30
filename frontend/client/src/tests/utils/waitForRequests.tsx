// eslint-disable-next-line import/no-extraneous-dependencies
import { GraphQLJsonRequestBody, MockedRequest } from 'msw';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SetupServerApi } from 'msw/node';

/**
 * Defines a listener for a request. The listener will wait for a specific mutation to fire, which can be awaited when
 * the mutation is to have fired.
 *
 * How to use it:
 * 1. Call `waitForRequest` with the request you want to wait for before the mutation is fired.
      *  This will return a `Promise` that resolves later when the mutation is fired.
 * 2. Simulate the action that is supposed to fire (such as a click).
 * 3. Await the `Promise` returned by `waitForRequest`.
 *
 * Example:
 * ```
 * const waitForRequest = waitForRequest(server, 'createUser');
 * createUserButton.click();
 * await waitForRequest;
 * ```
 *
 * Note: This function tests the implementation, and is not necessarily a best practice. But currently, this
 * is the only way to test form submits.
 */

export function waitForRequest<QueryVariables>(
  server: SetupServerApi, resolver: string,
): Promise<MockedRequest<GraphQLJsonRequestBody<QueryVariables>>> {
  let requestId = '';

  return new Promise((resolve, reject) => {
    server.events.on('request:start', (req: any) => {
      const matchesMethod = req.body.operationName.toLowerCase() === resolver.toLowerCase();
      if (matchesMethod) { requestId = req.id; }
    });
    server.events.on('request:match', (req) => {
      if (req.id === requestId) {
        resolve(req as MockedRequest<GraphQLJsonRequestBody<QueryVariables>>);
      }
    });
    server.events.on('request:unhandled', (req) => {
      if (req.id === requestId) {
        reject(
          new Error(`The ${req.method} ${req.url.href} request was unhandled.`),
        );
      }
    });
  });
}
