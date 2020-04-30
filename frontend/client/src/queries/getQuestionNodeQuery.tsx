import gql from 'graphql-tag';
import { QuestionFragment } from './QuestionFragment';
import { EdgeFragment } from './EdgeFragment';

export const getQuestionNodeQuery = gql`
  query getQuestionNode($id: ID!) {
    questionNode(where: { id: $id }) {
      ...QuestionFragment
      children {
        ...EdgeFragment
        childNode {
          ...QuestionFragment
          children {
            ...EdgeFragment
            childNode {
              ...QuestionFragment
            }
          }
        }
      }
    }
  }

  ${EdgeFragment}
  ${QuestionFragment}
`;
