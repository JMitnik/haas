import gql from 'graphql-tag';

export const GET_LEAF_NODES = gql`
      query getLeafNodes {
        leafNodes {
            title
            nodeId
            type {
              type
            }
        }
      }
    `