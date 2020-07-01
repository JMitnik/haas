import gql from 'graphql-tag';

const getUsersQuery = gql`
  query getUsers($customerSlug: String!) {
    users(customerSlug: $customerSlug) {
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
`;

export default getUsersQuery;
