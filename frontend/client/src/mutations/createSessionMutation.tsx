import gql from 'graphql-tag';

const createSessionMutation = gql`
    mutation createSession($input: SessionInput) {
        createSession(input: $input) {
            id
        }
    }
`;

export default createSessionMutation;
