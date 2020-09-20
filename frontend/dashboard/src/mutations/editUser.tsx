import gql from 'graphql-tag';

const editUserMutation = gql`
  mutation editUser($id: String!, $input: EditUserInput) {
    editUser(userId: $id, input: $input) {
      id
    }
  }
`;

export default editUserMutation;
