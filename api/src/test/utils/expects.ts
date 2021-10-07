import { GraphQLError } from 'graphql';

/**
 * Expect that a GraphQL error represents an Unauthorized access to a resolver.
 * @param { GraphQLError } error
 * @param { string } resolverName
 */
export const expectUnauthorizedErrorOnResolver = (error: GraphQLError, resolverName: string) => {
  expect(error.message).toContain('Not Authorised!');
  expect(error?.path?.[error?.path?.length - 1]).toEqual(resolverName);
}
