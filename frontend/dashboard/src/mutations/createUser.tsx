import { gql } from '@apollo/client';

const createUserMutation = gql`
  mutation createUser($customerSlug: String!, $input: UserInput) {
    createUser(customerSlug: $customerSlug, input: $input) {
        id
    }
  }
`;

export default createUserMutation;
