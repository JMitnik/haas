import { GraphQLYogaError } from '@graphql-yoga/node';
import { GraphQLErrorExtensions } from 'graphql';

/**
 * The UnauthenticatedError is thrown when an unauthenticated user is trying to access private GraphQL resources.
 */
export class UnauthenticatedError extends GraphQLYogaError {
  constructor(message: string = 'Unauthenticated', extensions?: GraphQLErrorExtensions) {
    super(message, { ...extensions, code: 'UNAUTHENTICATED' });

    Object.defineProperty(this, 'name', { value: 'UNAUTHENTICATED' });
  }
}
