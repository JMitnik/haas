import gql from 'graphql-tag';

import { CustomerFragment } from './CustomerFragment';
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
      customer {
        ...CustomerFragment
      }
    }
  }
  ${CustomerFragment}
  ${QuestionFragment}
`;
