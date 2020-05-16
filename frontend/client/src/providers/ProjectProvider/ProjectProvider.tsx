import React, { useState, useContext, useReducer, useEffect } from 'react';
import { Dialogue } from 'types/generic';
import gql from 'graphql-tag';
import { ProjectContextProps, ProjectStateProps, ProjectActionProps } from './ProjectProviderTypes';
import { useRouteMatch } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { getCustomerQuery } from 'queries/getCustomerQuery';
import { CustomerFragment } from 'queries/CustomerFragment';
import { QuestionFragment } from 'queries/QuestionFragment';

const getCustomerFromSlug = gql`
    query customer($slug: String!) {
        customer(slug: $slug) {
            ...CustomerFragment
        }
    }

    ${CustomerFragment}
`;


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
      rootQuestion {
        ...QuestionFragment
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

export const ProjectContext = React.createContext({} as ProjectContextProps);

const projectReducer = (state: ProjectStateProps, action: ProjectActionProps): ProjectStateProps => {
  switch (action.type) {
    case 'setCustomer': {
      return {
        ...state,
        customer: action.payload.customer
      };
    }

    case 'setDialogue': {
      return {
        ...state,
        dialogue: action.payload.dialogue
      };
    }

    case 'setCustomerAndDialogue': {
      return {
        dialogue: action.payload.dialogue,
        customer: action.payload.customer
      };
    }
  }
};


export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [{ customer, dialogue }, dispatchProjectState] = useReducer(projectReducer, {
    customer: null,
    dialogue: null,
  });

  const setCustomer = (customer: any) => dispatchProjectState({ type: 'setCustomer', payload: { customer } });
  const setDialogue = (dialogue: Dialogue) => dispatchProjectState({ type: 'setDialogue', payload: { dialogue } });

  const setCustomerAndDialogue = (customer: any, dialogue: Dialogue) => {
    dispatchProjectState({ type: 'setCustomerAndDialogue', payload: { dialogue, customer } })
  }

  const customerMatch = useRouteMatch<any>('/:customerSlug');
  const dialogueMatch = useRouteMatch<any>('/:customerSlug/:dialogueId');

  const { loading: customerLoading, data: customerData } = useQuery(getCustomerFromSlug, {
    skip: !customerMatch,
    onError: (e) => {
      console.log(e.message);
    },
    variables: {
      slug: customerMatch?.params.customerSlug
    }
  });

  const { loading: dialogueLoading, data: dialogueData } = useQuery(getDialogueQuery, {
    skip: !dialogueMatch,
    onError: (e) => {
      console.log(e.message);
    },
    variables: {
      id: dialogueMatch?.params.dialogueId,
    }
  });

  useEffect(() => {
    if (customerData) {
      setCustomer(customerData.customer);
    }
  }, [ customerData ]);

  useEffect(() => {
    if (dialogueData) {
      setCustomerAndDialogue(dialogueData.dialogue.customer, dialogueData.dialogue);
    }
  }, [ dialogueData ]);

  return (
      <ProjectContext.Provider value={{ customer, dialogue, setCustomer, setDialogue, setCustomerAndDialogue }}>
          {children}
      </ProjectContext.Provider>
  );
}

const useProject = () => {
  return useContext(ProjectContext);
}

export default useProject;
