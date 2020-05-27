import gql from 'graphql-tag';

import { EdgeFragment } from './EdgeFragment';
import { QuestionFragment } from './QuestionFragment';

export const getQuestionNodeQuery = gql`
  query getQuestionNode($id: String!) {
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
