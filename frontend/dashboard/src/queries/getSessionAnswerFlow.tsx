import gql from 'graphql-tag';

const getSessionAnswerFlowQuery = gql`
  query getSessionAnswerFlow($sessionId: ID!) {
    session(where: {
      id: $sessionId
    }) {
        id
        nodeEntries {
          id
          depth
          relatedNode {
            title
            type
          }
          value {
            slider
            textbox
            register
            choice
          }
        }
        relatedNode {
          title
        }
      }
    }
`;

export default getSessionAnswerFlowQuery;
