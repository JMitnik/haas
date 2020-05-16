import gql from 'graphql-tag';
import { ShallowNodeFragment } from './ShallowNodeFragment';

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
      title
    }
    childNode {
      ...ShallowNodeFragment
    }
  }

  ${ShallowNodeFragment}
`;
