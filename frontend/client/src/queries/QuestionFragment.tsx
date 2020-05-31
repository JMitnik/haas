import gql from 'graphql-tag';

import { EdgeFragment } from './EdgeFragment';
import { ShallowNodeFragment } from './ShallowNodeFragment';

export const QuestionFragment = gql`

  fragment QuestionFragment on QuestionNode {
    ...ShallowNodeFragment
    children {
      ...EdgeFragment
      parentNode {
        id
      }
      childNode {
        id
      }
    }
    options {
      id
      value
      publicValue
    }
  }

  ${ShallowNodeFragment}
  ${EdgeFragment}
`;
