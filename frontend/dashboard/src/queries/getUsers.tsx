import gql from 'graphql-tag';

const getUsersQuery = gql`
  query getUsers($customerSlug: String!) {
    customer(slug: $customerSlug) {
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
