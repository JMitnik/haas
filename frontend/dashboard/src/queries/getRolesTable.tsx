import gql from 'graphql-tag';

// TODO: Add filter input
const getRolesQuery = gql`
  query getRolesTable($customerId: String!, $filter: PaginationWhereInput) {
    roleConnection(customerId: $customerId, filter: $filter) {
      roles {
        id
        name
        nrPermissions
        permissions {
          id
          name
        }
      }
      permissions {
        id
        name
      }
      pageInfo {
        pageIndex
        nrPages
      }
    }
  }
`;

export default getRolesQuery;
