import { GraphQLError } from 'graphql-request/dist/types';

/**
 * Expect that a GraphQL error represents an Unauthorized access to a resolver.
 * @param { GraphQLError } error
 * @param { string } resolverName
 */
export const expectUnauthorizedErrorOnResolver = (error: GraphQLError | undefined, resolverName: string) => {
  if (!error) throw new Error('undefined error');
  expect(error.message).toContain('Unauthorized');
  expect(error?.path?.[error?.path?.length - 1]).toEqual(resolverName);
}
