import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { QuestionFragment } from 'queries/QuestionFragment';
import { CustomerFragment } from 'queries/CustomerFragment';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { ThemeProvider } from 'styled-components';
import { makeCustomTheme } from 'utils/makeCustomerTheme';
import Loader from 'components/Loader';
import NodePage from './[node]';
import DialogueTreeLayout from 'components/DialogueTreeLayout';
import useProject from 'providers/ProjectProvider';

const getDialogueQuery = gql`
  query getDialogue($id: ID!) {
    dialogue(where: { id: $id }) {
      id
      title
      publicTitle
      creationDate
      updatedAt
      leafs {
        id
        title
        type
      }
      customerId
      questions {
        ...QuestionFragment
      }
      customer {
        ...CustomerFragment
      }
    }
  }
  ${CustomerFragment}
  ${QuestionFragment}
`;


const DialogueTreePage = () => {
  const { customer, dialogue } = useProject();

  return (
      <NodePage />
  );
}

export default DialogueTreePage;
