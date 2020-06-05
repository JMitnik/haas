import gql from 'graphql-tag';

// TODO: Add filter input
const getRolesQuery = gql`
  query getRoles($customerId: String!) {
    roles(customerId: $customerId) {
        name
        id
        amtPermissions
        permissions {
            name
        }      
    }
  }
`;

export default getRolesQuery;
