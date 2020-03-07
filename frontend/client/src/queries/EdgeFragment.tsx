import gql from 'graphql-tag';

export const EdgeFragment = gql`
  fragment EdgeFragment on Edge {
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
`;
