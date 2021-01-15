import { gql } from '@apollo/client';

const getUsersQuery = gql`
  query getUsers($customerSlug: String!) {
    customer(slug: $customerSlug) {
      id
      users {
        id
        firstName
        lastName
        email
        phone
        role {
          id
          name
        }
      }
    }
  }
`;

export default getUsersQuery;
