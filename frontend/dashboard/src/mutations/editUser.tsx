import gql from 'graphql-tag';

const editUserMutation = gql`
  mutation editUser($id: String!, $input: UserInput) {
    editUser(id: $id, input: $input) {
        id
    }
  }
`;

export default editUserMutation;
