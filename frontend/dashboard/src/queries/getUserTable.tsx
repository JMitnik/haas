import gql from 'graphql-tag';

// TODO: Add filter input
const getUsersQuery = gql`
  query getUserTable($customerId: String!,$filter: FilterInput) {
    userTable(customerId: $customerId, filter: $filter) {
      users {
        id
        email
        firstName
        lastName
        role {
            id
            name
        }
      }
      totalPages
      pageIndex
    }
  }
`;

export default getUsersQuery;
