import { GraphQLYogaError } from '@graphql-yoga/node';

class AuthorizationError extends GraphQLYogaError {
  constructor(message: string, code: string = 'Unauthorized') {
    super(message, code);
  }
}

export default AuthorizationError;
