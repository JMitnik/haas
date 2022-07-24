/* eslint-disable no-prototype-builtins */
// utils/graphql-test-utils.js

interface CypressRequest {
  alias: string;
  body: {
    operationName?: string;
  }
}

// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (req: CypressRequest, operationName: string) => {
  const body = req.body as unknown as Record<string, any>;
  if (!body) return false;

  return (
    body.hasOwnProperty('operationName') && body.operationName === operationName
  );
};

// Alias query if operationName matches
export const aliasQuery = (req: CypressRequest, operationName: string) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`;
  }
};

// Alias mutation if operationName matches
export const aliasMutation = (req: CypressRequest, operationName: string) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`;
  }
};

export const mockQuery = (operationName: string, payload: any, url: string = 'http://localhost:4000/graphql') => {
  cy.intercept('POST', url, (req) => {
    // @ts-ignore
    aliasQuery(req, operationName);

    req.reply({ data: payload });
  });
};

export const mockMutation = (operationName: string, payload: any, url: string = 'http://localhost:4000/graphql') => {
  cy.intercept('POST', url, (req) => {
    // @ts-ignore
    aliasMutation(req, operationName);

    req.reply({ data: payload });
  });
};
