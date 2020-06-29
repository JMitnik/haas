import gql from 'graphql-tag';

const getRolesQuery = gql`
  query getRoles($customerSlug: String!) {
    roles(customerSlug: $customerSlug) {
        id
        name
    }
  }
`;

export default getRolesQuery;
