import gql from 'graphql-tag';

const getUsersQuery = gql`
  query getTriggerTable($customerSlug: String!,$filter: FilterInput) {
    triggerTable(customerSlug: $customerSlug, filter: $filter) {
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
      totalPages
      pageIndex
    }
  }
`;

export default getUsersQuery;
