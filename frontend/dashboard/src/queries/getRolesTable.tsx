import gql from 'graphql-tag';

// TODO: Add filter input
const getRolesQuery = gql`
  query getRolesTable($customerId: String!, $filter: FilterInput) {
    roleTable(customerId: $customerId, filter: $filter) {
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
      totalPages
      pageIndex
    }
  }
`;

export default getRolesQuery;
