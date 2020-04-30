import gql from 'graphql-tag';

export const QuestionFragment = gql`
  fragment QuestionFragment on QuestionNode {
    id
    title
    overrideLeafId
    overrideLeaf {
      id
      title
      type
    }
    type
    children {
      id
      conditions {
        conditionType
        renderMin
        renderMax
        matchValue
      }
      parentNodeId
      childNodeId
    }
    options {
      value
      publicValue
    }
  }
`;
