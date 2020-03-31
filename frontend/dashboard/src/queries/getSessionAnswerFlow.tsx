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
          multiValues {
            textValue
          }
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
