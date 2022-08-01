import { GraphQLYogaError } from '@graphql-yoga/node';
import { GraphQLErrorExtensions } from 'graphql';

/**
 * The FailedProcessError is thrown when a process (like a mutation or job) failed suddenly due to an unexpected error.
 */
export class FailedProcessError extends GraphQLYogaError {
  constructor(message: string = 'Failed Process', extensions?: GraphQLErrorExtensions) {
    super(message, { ...extensions, code: 'FAILED_PROCESS' });

    Object.defineProperty(this, 'name', { value: 'FAILED_PROCESS' });
  }
}
