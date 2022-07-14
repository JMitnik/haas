import { ApolloError } from 'apollo-server-errors';

/**
 * The MissingFieldError is thrown when a field is missing from the request. This should be fixed by the frontend.
 */
export class MissingFieldError extends ApolloError {
  constructor(message: string) {
    super(message, 'MISSING_FIELD_INPUT');

    Object.defineProperty(this, 'name', { value: 'MissingField' });
  }
}
