import gql from 'graphql-tag';

const loginUserMutation = gql`
    mutation login($input: LoginInput) {
        login(input: $input) {
            token
            expiryDate
            user {
                email
                firstName
                lastName
                id
            }
        }
    }
`;

export default loginUserMutation;
