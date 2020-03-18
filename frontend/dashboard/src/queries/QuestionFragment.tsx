/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const QuestionFragment = gql`
  fragment QuestionFragment on QuestionNode {
    id
    title
    overrideLeaf {
      id
      nodeId
      type
      title
    }
    questionType
    edgeChildren {
      id
      conditions {
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
        value
        publicValue
    }
  }

  # {SubQuestionFragment}
`;
