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
    type
    edgeChildren {
      id
      conditions {
        conditionType
        renderMin
        renderMax
        matchValue
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
`;
