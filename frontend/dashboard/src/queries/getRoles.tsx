import gql from 'graphql-tag';

const getRolesQuery = gql`
  query getRoles($customerId: String!) {
    roles(customerId: $customerId) {
        id
        name
    }
  }
`;

export default getRolesQuery;
