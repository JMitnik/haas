import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import { useErrorHandler } from 'react-error-boundary';
import DialogueOverview from 'views/DialogueOverview';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';

const DialoguesPage = () => {
  const { customerSlug } = useParams();

  // TODO: Handle the loading
  const { error, data } = useQuery<any>(getDialoguesOfCustomer, {
    variables: { customerSlug },
  });
  useErrorHandler(error);

  let dialogues: any[] = [];

  if (data) {
    dialogues = data?.customer?.dialogues;
  }

  return <DialogueOverview dialogues={dialogues} />;
};

export default DialoguesPage;
