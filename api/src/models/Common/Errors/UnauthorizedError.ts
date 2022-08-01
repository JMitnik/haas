import { GraphQLYogaError } from '@graphql-yoga/node';
import { GraphQLErrorExtensions } from 'graphql';

/**
 * The UnauthenticatedError is thrown when an authenticated user is trying to access private GraphQL resources they
 * have no permissions to.
 */
export class UnauthorizedError extends GraphQLYogaError {
  constructor(message: string = 'Unauthorized', extensions?: GraphQLErrorExtensions) {
    super(message, { ...extensions, code: 'UNAUTHORIZED' });

    Object.defineProperty(this, 'name', { value: 'UNAUTHORIZED' });
  }
}
