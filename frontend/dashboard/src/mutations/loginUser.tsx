import gql from 'graphql-tag';

const loginUserMutation = gql`
    mutation login($input: LoginInput) {
        login(input: $input) {
            id
        }
    }
`;

export default loginUserMutation;
