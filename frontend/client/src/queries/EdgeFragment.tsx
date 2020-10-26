import gql from 'graphql-tag';

export const EdgeFragment = gql`
  fragment EdgeFragment on Edge {
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
      # title
    }
    childNode {
      id
      # title
      # isRoot
      # children {
      #   id
      # }
      # type
    }
  }
`;
