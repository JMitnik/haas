import gql from 'graphql-tag';

const getInteractionsQuery = gql`
  query getInteractions($dialogueId: ID!, $filter: InteractionFilterInput) {
    interactions(where: { dialogueId: $dialogueId }, filter: $filter) {
        sessionId
        createdAt
        paths
        score
        index
      }
  }
`;

export default getInteractionsQuery;
