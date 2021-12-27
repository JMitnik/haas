declare namespace Cypress {
  interface Chainable {

    /**
     * Intercepts a GraphQL call to our GraphQL API.
     */
    graphql(
      operationName: string,
      callback: (req: import('cypress/types/net-stubbing').CyHttpMessages.IncomingHttpRequest) => void,
      alias: string,
    ): void;
  }
}