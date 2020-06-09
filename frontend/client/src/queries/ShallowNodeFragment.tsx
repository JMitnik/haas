import gql from 'graphql-tag';

export const ShallowNodeFragment = gql`
  fragment ShallowNodeFragment on QuestionNode {
    id
    title
    isRoot
    # overrideLeafId
    # options {
    #   id
    #   value
    #   publicValue
    # }
    # overrideLeaf {
    #   id
    #   title
    #   type
    # }
    children {
      id
    }
    type
  }
`;
