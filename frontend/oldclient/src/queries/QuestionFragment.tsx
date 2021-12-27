import gql from 'graphql-tag';

import { EdgeFragment } from './EdgeFragment';

export const QuestionFragment = gql`

  fragment QuestionFragment on QuestionNode {
    id
    title
    isRoot
    isLeaf
    type
    extraContent
    sliderNode {
      id
      happyText
      unhappyText
      markers {
        id
        label
        subLabel
        range {
          id
          start
          end
        }
      }
    }
    children {
      ...EdgeFragment
      parentNode {
        id
      }
      childNode {
        id
      }
    }
    overrideLeaf {
      id
      title
      type
    }
    options {
      id
      value
      publicValue
      overrideLeaf {
        id
      }
    }
  }

  ${EdgeFragment}
`;
