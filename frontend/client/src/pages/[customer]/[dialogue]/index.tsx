import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import DialogueTree from 'components/DialogueTree';
import { Loader } from '@haas/ui';
import { QuestionFragment } from 'queries/QuestionFragment';
import { CustomerFragment } from 'queries/CustomerFragment';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { ThemeProvider } from 'styled-components';
import { makeCustomTheme } from 'utils/makeCustomerTheme';
import { DialogueTreeProvider } from 'providers/dialogue-tree-provider';

const getDialogueQuery = gql`
  query getQuestionnaire($id: ID) {
    questionnaire(where: { id: $id }) {
      id
      title
      publicTitle
      creationDate
      rootQuestion {
        ...QuestionFragment
      }
      updatedAt
      leafs {
        id
        title
        type
      }
      customer {
        ...CustomerFragment
      }
      questions(where: { isRoot: true }) {
        ...QuestionFragment
      }
    }
  }

  ${QuestionFragment}
  ${CustomerFragment}
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
    if (data?.questionnaire?.customer?.name) {
      window.document.title = `${data.questionnaire?.customer?.name} | Powered by HAAS`;
    }

    if (data?.questionnaire?.customer?.settings) {
      const customerTheme = { colors: data.questionnaire?.customer?.settings.colourSettings };
      setCustomTheme(customerTheme);
    }
  }, [data]);


  if (loading) return <Loader/>
  if (error) return <p>Shit</p>

  const questionnaire = data?.questionnaire;
  const customer = data?.questionnaire?.customer;

  return (
    <DialogueTreeProvider customer={customer} questionnaire={questionnaire}>
      <ThemeProvider theme={(theme: any) => makeCustomTheme(theme, customTheme)}>
        <DialogueTree />
      </ThemeProvider>
    </DialogueTreeProvider>
  );
}

export default DialogueTreePage;
