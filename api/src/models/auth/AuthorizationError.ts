import { ApolloError } from 'apollo-server-express';

class AuthorizationError extends ApolloError {
  constructor(message: string, code: string = 'Unauthorized') {
    super(message, code);
  }
}

export default AuthorizationError;
