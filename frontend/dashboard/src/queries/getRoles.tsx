import gql from 'graphql-tag';

// TODO: Add filter input
const getRolesQuery = gql`
  query getRoles($customerId: String!) {
    roleTable(customerId: $customerId) {
      roles {
        id
        name
        amtPermissions
        permissions {
          id
          name
        }
      }
      permissions {
        id
        name
      }
    }
  }
`;

export default getRolesQuery;
