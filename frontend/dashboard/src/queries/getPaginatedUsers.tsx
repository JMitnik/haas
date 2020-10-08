import gql from 'graphql-tag';

const getPaginatedUsers = gql`
  query getPaginatedUsers($customerSlug: String!, $filter: PaginationWhereInput) {
    customer(slug: $customerSlug) {
      id
      
      usersConnection(filter: $filter) {
        userCustomers {
          user {
            id
            email
            firstName
            lastName
          }
          role {
            id
            name
          }
        }

        totalPages
        pageIndex
      }
    }
  }
`;

export default getPaginatedUsers;
