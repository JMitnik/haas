import gql from 'graphql-tag';

const createUserMutation = gql`
  mutation createUser($customerSlug: String!, $input: UserInput) {
    createUser(customerSlug: $customerSlug, input: $input) {
        id
    }
  }
`;

export default createUserMutation;
