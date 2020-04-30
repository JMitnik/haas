import gql from 'graphql-tag';
import { ShallowNodeFragment } from './ShallowNodeFragment';
import { EdgeFragment } from './EdgeFragment';

export const QuestionFragment = gql`
  fragment QuestionFragment on QuestionNode {
    ...ShallowNodeFragment
    children {
      ...EdgeFragment
      parentNode {
        ...ShallowNodeFragment
      }
      childNode {
        ...ShallowNodeFragment
        children {
          ...EdgeFragment
          childNode {
            ...ShallowNodeFragment
            children {
              childNode {
                ...ShallowNodeFragment
              }
            }
          }
        }
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
