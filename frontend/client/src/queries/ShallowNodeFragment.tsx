import gql from 'graphql-tag';

export const ShallowNodeFragment = gql`
  fragment ShallowNodeFragment on QuestionNode {
    id
    title
    isRoot
    overrideLeafId
    overrideLeaf {
      id
      title
      type
    }
    type
  }
`;
