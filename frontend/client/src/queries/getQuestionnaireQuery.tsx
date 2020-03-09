import gql from 'graphql-tag';
import { CustomerFragment } from './CustomerFragment';
import { QuestionFragment } from './QuestionFragment';

export const getQuestionnaireQuery = gql`
  query getQuestionnairesOfCustomer($id: ID) {
  questionnaires(where: { customer: {
  	id: $id 
  } }) {
    id
    title
    publicTitle
    creationDate
    updatedAt
    questions {
      title
      overrideLeaf {
        id
      }
    }
    leafs {
      id
    }
  }
}
  ${QuestionFragment}
  ${CustomerFragment}
`;
