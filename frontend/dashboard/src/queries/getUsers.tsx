import gql from 'graphql-tag';

const getUsersQuery = gql`
  query getUsers($customerId: String!) {
    users(customerId: $customerId) {
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
