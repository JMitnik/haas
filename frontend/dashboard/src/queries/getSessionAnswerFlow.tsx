import gql from 'graphql-tag';

const getSessionAnswerFlowQuery = gql`
  query getSessionAnswerFlow($sessionId: ID) {
    session(where: { 
      id: $sessionId
    }) {
        id
        nodeEntries {
        values {
          numberValue
          textValue
          id
        }
        relatedNode {
          title
        }
      }
    }
  }

`;

export default getSessionAnswerFlowQuery;
