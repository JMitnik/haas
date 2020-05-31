import gql from 'graphql-tag';

import { CustomerFragment } from './CustomerFragment';
import { EdgeFragment } from './EdgeFragment';
import { QuestionFragment } from './QuestionFragment';

export const getQuestionnaireQuery = gql`
  query getQuestionnaire($id: ID!) {
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
      questions(where: { isRoot: true }) {
        ...QuestionFragment
      }
      edges {
        ...EdgeFragment
      }
      customer {
        ...CustomerFragment
      }
    }
  }

  ${EdgeFragment}
  ${CustomerFragment}
  ${QuestionFragment}
`;
