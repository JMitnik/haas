import gql from 'graphql-tag';

const QuestionFragment = gql`
  fragment QuestionFragment on QuestionNode {
    id
    title
    isRoot
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
