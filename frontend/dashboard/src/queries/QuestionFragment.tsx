import gql from 'graphql-tag';

export const QuestionFragment = gql`
  fragment QuestionFragment on QuestionNode {
    id
    title
    overrideLeaf {
      id
      type
      title
    }
    type
    children {
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
`;
