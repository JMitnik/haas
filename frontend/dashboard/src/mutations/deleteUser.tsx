import gql from 'graphql-tag';

const deleteUser = gql`
  mutation deleteUser($input: DeleteUserInput!) {
    deleteUser( input: $input ) {
      deletedUser
    }
}
`;

export default deleteUser;
