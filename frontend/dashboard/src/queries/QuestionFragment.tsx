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
    nrOfEntries
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
    relatedTopic {
      id
      label
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
        overrideLeaf {
          id
          title
          type
        }

        relatedTopicValue {
          id
          label
        }
    }
  }
`;

export default QuestionFragment;
