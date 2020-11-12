import gql from 'graphql-tag';

const createInteractionMutation = gql`
    mutation createSession($input: SessionInput) {
        createSession(input: $input) {
            id
        }
    }
`;

export default createInteractionMutation;
