import gql from 'graphql-tag';

const loginUserMutation = gql`
    mutation login($input: LoginInput) {
        login(input: $input) {
            token
            user {
                email
                firstName
                lastName
            }
        }
    }
`;

export default loginUserMutation;
