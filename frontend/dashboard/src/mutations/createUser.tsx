import gql from 'graphql-tag';

const createUserMutation = gql`
  mutation createUser($id: String!, $input: UserInput) {
    createUser(id: $id, input: $input) {
        id
    }
  }
`;

export default createUserMutation;
