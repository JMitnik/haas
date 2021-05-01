declare namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login to dashboard
      */
      login(): void;

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