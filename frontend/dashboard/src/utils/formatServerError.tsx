import errors from 'config/errors';

const formatServerError = (errorMessage: string): string => {
  if (errorMessage in errors) {
    return errors[errorMessage];
  }

  if (errorMessage.startsWith('GraphQL')) {
    return errorMessage.slice(14);
  }

  return 'Something went wrong in the server, try again';
};

export default formatServerError;
