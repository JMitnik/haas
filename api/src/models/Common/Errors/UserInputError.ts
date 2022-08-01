import { GraphQLYogaError } from '@graphql-yoga/node';
import { GraphQLErrorExtensions } from 'graphql';

/**
 * The MissingFieldError is thrown when a field is missing from the request. This should be fixed by the frontend.
 */
export class UserInputError extends GraphQLYogaError {
  constructor(message: string, extensions?: GraphQLErrorExtensions) {
    super(message, { ...extensions, code: 'BAD_USER_INPUT' });

    Object.defineProperty(this, 'name', { value: 'UserInputError' });
  }
}
