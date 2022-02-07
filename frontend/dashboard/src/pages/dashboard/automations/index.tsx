import { Spinner, useToast } from '@chakra-ui/core';
import { useParams } from 'react-router-dom';
import React from 'react';

import { useAutomationConnectionQuery } from 'types/generated-types';
import { useErrorHandler } from 'react-error-boundary';
import AutomationsOverview from 'views/AutomationsOverview';

const AutomationsPage = () => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const toast = useToast();

  const { data, error, loading } = useAutomationConnectionQuery({
    variables: {
      workspaceSlug: customerSlug,
    },
    fetchPolicy: 'cache-and-network',
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'There was a problem with our servers. Please try again later',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
  });
  useErrorHandler(error);

  if (loading && !data) {
    return <Spinner />;
  }

  return <AutomationsOverview automationConnection={data?.customer?.automationConnection as any} />;
};

export default AutomationsPage;
