import { GraphQLYogaError } from '@graphql-yoga/node';
import { GraphQLErrorExtensions } from 'graphql';

/**
 * The ExistingResourceError is thrown when a resource already exists in a database (such as workspace with unique
 * slug).
 */
export class ExistingResourceError extends GraphQLYogaError {
  constructor(message: string = 'Existing Resource', extensions?: GraphQLErrorExtensions) {
    super(message, { ...extensions, code: 'EXISTING_RESOURCE' });

    Object.defineProperty(this, 'name', { value: 'EXISTING_RESOURCE' });
  }
}
