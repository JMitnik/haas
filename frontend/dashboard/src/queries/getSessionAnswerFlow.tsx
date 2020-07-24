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
            sliderNodeEntry
            textboxNodeEntry
            registrationNodeEntry
            linkNodeEntry
            choiceNodeEntry
          }
        }
      }
    }
`;

export default getSessionAnswerFlowQuery;
