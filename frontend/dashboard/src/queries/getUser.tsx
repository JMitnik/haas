import { gql } from '@apollo/client';

const getUserQuery = gql`
  query getUser($id: String!) {
    user(userId: $id) {
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

export default getUserQuery;
