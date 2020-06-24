import gql from 'graphql-tag';

const deleteUser = gql`
  mutation deleteUser($id: String!) {
    deleteUser( id: $id ) {
      id
    }
}
`;

export default deleteUser;
