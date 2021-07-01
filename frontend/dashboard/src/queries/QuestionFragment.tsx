import { gql } from '@apollo/client';

const QuestionFragment = gql`
  fragment QuestionFragment on QuestionNode {
    id
    title
    creationDate
    updatedAt
    isRoot
    isLeaf
    extraContent
    overrideLeaf {
      id
      type
      title
    }
    sliderNode {
      markers {
        id
        label
        subLabel
        range {
          start
          end
        }
      }
    }
    type
    children {
      id
      conditions {
        id
        conditionType
        matchValue
        renderMin
        renderMax
      }
      parentNode {
        id
        title
      }
      childNode {
        id
        title
      }
    }
    options {
        id
        value
        publicValue
        position
        overrideLeaf {
          id
          title
          type
        }
    }
  }
`;

export default QuestionFragment;
