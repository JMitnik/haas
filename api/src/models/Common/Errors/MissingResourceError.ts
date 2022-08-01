import { GraphQLYogaError } from '@graphql-yoga/node';
import { GraphQLErrorExtensions } from 'graphql';

/**
 * The MissingResourceError is thrown when a certain resource is expected but missing (from database for example).
 *
 * Examples:
 * - Workspace name not existing
 * - User not existing
 */
export class MissingResourceError extends GraphQLYogaError {
  constructor(message: string, extensions?: GraphQLErrorExtensions) {
    super(message, { ...extensions, code: 'MISSING_RESOURCE' });

    Object.defineProperty(this, 'name', { value: 'MissingResourceError' });
  }
}
