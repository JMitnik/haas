import errors from 'config/errors';

const formatServerError = (errorMessage: string): string => {
  if (errorMessage in errors) {
    return errors[errorMessage];
  }

  return 'Something went wrong in the server, try again';
};

export default formatServerError;
