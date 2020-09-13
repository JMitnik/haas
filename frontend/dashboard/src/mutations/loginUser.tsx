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
                userCustomers {
                    customer {
                        id
                        name
                    }
                    role {
                        permissions
                    }
                }
            }
        }
    }
`;

export default loginUserMutation;
