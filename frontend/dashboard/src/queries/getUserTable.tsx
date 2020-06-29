import gql from 'graphql-tag';

const getUsersQuery = gql`
  query getUserTable($customerSlug: String!,$filter: FilterInput) {
    userTable(customerSlug: $customerSlug, filter: $filter) {
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
