import gql from 'graphql-tag';

const getUsersQuery = gql`
  query getUserTable($customerSlug: String!,$filter: PaginationWhereInput) {
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
