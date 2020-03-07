import gql from 'graphql-tag';
import { QuestionFragment } from './QuestionFragment';

export const getQuestionNodeQuery = gql`
  query getQuestionNode($id: ID!) {
    questionNode(where: { id: $id }) {
      ...QuestionFragment
    }
  }

  ${QuestionFragment}
`;
