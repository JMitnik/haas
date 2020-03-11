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
