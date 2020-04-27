import gql from 'graphql-tag';

const QuestionFragment = gql`
  fragment QuestionFragment on QuestionNode {
    id
    title
    overrideLeafId
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

export default QuestionFragment;
