import gql from 'graphql-tag';

const getNewSessionId = gql`
    query getNewSessionId {
        newSessionId
    }
`;

export default getNewSessionId;
