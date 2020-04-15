import gql from 'graphql-tag';
import { CustomerFragment } from './CustomerFragment';
import { QuestionFragment } from './QuestionFragment';

export const getQuestionnaireQuery = gql`
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
