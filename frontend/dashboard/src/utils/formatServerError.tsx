import errors from 'config/errors';

const formatServerError = (errorMessage: string): string => {
  if (errorMessage in errors) {
    return errors[errorMessage];
  }

  return errorMessage;
};

export default formatServerError;
