import gql from 'graphql-tag';
import QuestionFragment from './QuestionFragment';
import { CustomerFragment } from './CustomerFragment';

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
