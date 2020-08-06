import { Alert, AlertIcon } from '@chakra-ui/core';
import React from 'react';
import formatServerError from 'utils/formatServerError';

const ServerError = ({ serverError }: { serverError: Error }) => (
  <>
    {serverError && (
      <Alert status="error">
        <AlertIcon />
        {formatServerError(serverError.message)}
      </Alert>
    )}
  </>
);

export default ServerError;
