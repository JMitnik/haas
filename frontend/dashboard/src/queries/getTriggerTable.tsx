import { gql } from '@apollo/client';

const getUsersQuery = gql`
  query getTriggerTable($customerSlug: String!,$filter: PaginationWhereInput) {
    triggerConnection(customerSlug: $customerSlug, filter: $filter) {
      triggers {
        id
        name
        medium
        type
        conditions {
            id
            type
            minValue
            maxValue
            textValue
        }
        recipients {
            id
            firstName
            lastName
            phone
            email
        }
      }
      pageInfo {
        pageIndex
        nrPages
      }
    }
  }
`;

export default getUsersQuery;
