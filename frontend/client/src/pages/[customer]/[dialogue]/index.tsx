import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { QuestionFragment } from 'queries/QuestionFragment';
import { CustomerFragment } from 'queries/CustomerFragment';
import { useParams, useLocation, Route } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { ThemeProvider } from 'styled-components';
import { makeCustomTheme } from 'utils/makeCustomerTheme';
import { DialogueTreeProvider } from 'providers/dialogue-tree-provider';
import Loader from 'components/Loader';
import NodePage from './[node]';
import DialogueTreeLayout from 'components/DialogueTree/DialogueTreeLayout';

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
  const { dialogueId } = useParams();
  const [customTheme, setCustomTheme] = useState({});

  const { data, error, loading } = useQuery(getDialogueQuery, {
    variables: {
      id: dialogueId,
    }
  });

  // Customize app for customer
  useEffect(() => {
    if (data?.dialogue?.customer?.name) {
      window.document.title = `${data.dialogue?.customer?.name} | Powered by HAAS`;
    }

    if (data?.dialogue?.customer?.settings) {
      const customerTheme = { colors: data.dialogue?.customer?.settings.colourSettings };
      setCustomTheme(customerTheme);
    }
  }, [data]);

  if (loading) return <Loader/>
  if (error) return <p>Shit</p>

  const dialogue = data?.dialogue;
  const customer = data?.dialogue?.customer;

  return (
    <DialogueTreeProvider customer={customer} dialogue={dialogue}>
      <ThemeProvider theme={(theme: any) => makeCustomTheme(theme, customTheme)}>
        <DialogueTreeLayout>
          <NodePage />
        </DialogueTreeLayout>
      </ThemeProvider>
    </DialogueTreeProvider>
  );
}

export default DialogueTreePage;
