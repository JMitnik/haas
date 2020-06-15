import gql from 'graphql-tag';

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
