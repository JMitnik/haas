import gql from 'graphql-tag';

const getInteractionsQuery = gql`
  query getInteractions($dialogueId: ID!, $filter: InteractionFilterInput) {
    interactions(where: { dialogueId: $dialogueId }, filter: $filter) {
        sessions {
          id
          createdAt
          paths
          score
          index
        }
        orderBy {
            id
            desc
          }
        pages
        pageIndex
        startDate
        endDate
      }
  }
`;

export default getInteractionsQuery;
