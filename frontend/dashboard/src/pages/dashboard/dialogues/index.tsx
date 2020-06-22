import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import DialogueOverview from 'views/DialogueOverview';
import getQuestionnairesCustomerQuery from 'queries/getQuestionnairesCustomerQuery';

const DialoguesPage = () => {
  const { customerId } = useParams();

  // TODO: Handle the loading
  const { loading, error, data } = useQuery<any>(getQuestionnairesCustomerQuery, {
    variables: { id: customerId },
  });

  let dialogues: any[] = [];

  if (error) {
    return (
      <p>
        Error:
        {' '}
        {error.message}
      </p>
    );
  }

  if (data) {
    dialogues = data?.dialogues;
  }

  return <DialogueOverview dialogues={dialogues} />;
};

export default DialoguesPage;
