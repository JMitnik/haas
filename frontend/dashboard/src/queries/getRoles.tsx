import { gql } from '@apollo/client';

const getRolesQuery = gql`
  query getRoles($customerSlug: String!) {
    roles(customerSlug: $customerSlug) {
        id
        name
    }
  }
`;

export default getRolesQuery;
