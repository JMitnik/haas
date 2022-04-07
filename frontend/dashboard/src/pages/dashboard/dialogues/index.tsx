import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import { Spinner, useToast } from '@chakra-ui/core';
import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';

import { DialogueConnectionOrder, useDialogueConnectionLazyQuery, useDialogueConnectionQuery } from 'types/generated-types';
import { useErrorHandler } from 'react-error-boundary';
import DialogueOverview from 'views/DialogueOverview';

const DialoguesPage = () => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const toast = useToast();

  const { error, data, loading } = useDialogueConnectionQuery({
    variables: {
      customerSlug,
      filter: {
        offset: 0,
        perPage: 10,
        orderBy: {
          by: DialogueConnectionOrder.CreatedAt,
          desc: true,
        },
      },
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

  // TODO: Handle the loading
  // const { error, data } = useQuery<any>(getDialoguesOfCustomer, {
  //   variables: { customerSlug },
  //   fetchPolicy: 'cache-and-network',
  //   onError: () => {
  //     toast({
  //       title: 'Something went wrong',
  //       description: 'There was a problem with our servers. Please try again later',
  //       status: 'error',
  //       position: 'bottom-right',
  //       isClosable: true,
  //     });
  //   },
  // });

  useErrorHandler(error);

  if (loading && !data) {
    return <Spinner />;
  }

  console.log('connection: ', data);

  return (
    <DialogueOverview
      dialogueConnection={data?.customer?.dialogueConnection}
    />
  );
};

export default DialoguesPage;
