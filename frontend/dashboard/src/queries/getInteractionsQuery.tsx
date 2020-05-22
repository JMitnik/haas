import gql from 'graphql-tag';

const getInteractionsQuery = gql`
  query getInteractions($dialogueId: ID!, $filter: InteractionFilterInput) {
    interactions(where: { dialogueId: $dialogueId }, filter: $filter) {
        sessions {
          sessionId
          createdAt
          paths
          score
          index
        }
        pages
        pageIndex
      }
  }
`;

export default getInteractionsQuery;
