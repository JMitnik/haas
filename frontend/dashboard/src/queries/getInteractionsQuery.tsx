import gql from 'graphql-tag';

const getInteractionsQuery = gql`
  query getInteractions($dialogueId: ID!) {
    interactions(where: { dialogueId: $dialogueId }) {
        sessionId
        createdAt
        paths
        score
      }
  }
`;

export default getInteractionsQuery;
