import gql from 'graphql-tag';

const getUsersQuery = gql`
  query getTriggerTable($customerId: String!,$filter: FilterInput) {
    triggerTable(customerId: $customerId, filter: $filter) {
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
