import gql from 'graphql-tag';

// TODO: Add filter input
const getUsersQuery = gql`
  query getUsers($customerId: String!) {
    users(customerId: $customerId) {
        id
        email
        firstName
        lastName
        role {
            id
            name
        }
    }
  }
`;

export default getUsersQuery;
