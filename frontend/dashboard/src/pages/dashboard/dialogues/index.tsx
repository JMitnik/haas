import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useToast } from '@chakra-ui/core';
import React from 'react';

import { useErrorHandler } from 'react-error-boundary';
import DialogueOverview from 'views/DialogueOverview';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';

const DialoguesPage = () => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const toast = useToast();

  // TODO: Handle the loading
  const { error, data } = useQuery<any>(getDialoguesOfCustomer, {
    variables: { customerSlug },
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

  let dialogues: any[] = [];

  if (data) {
    dialogues = data?.customer?.dialogues;
  }

  return <DialogueOverview dialogues={dialogues} />;
};

export default DialoguesPage;
