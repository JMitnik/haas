import gql from 'graphql-tag';

const QuestionFragment = gql`
  fragment QuestionFragment on QuestionNode {
    id
    title
    isRoot
    isLeaf
    overrideLeaf {
      id
      type
      title
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
    }
  }
`;

export default QuestionFragment;
