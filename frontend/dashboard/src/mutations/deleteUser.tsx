import { gql } from '@apollo/client';

const deleteUser = gql`
  mutation deleteUser($input: DeleteUserInput!) {
    deleteUser( input: $input ) {
      deletedUser
    }
}
`;

export default deleteUser;
