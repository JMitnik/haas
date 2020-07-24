import gql from 'graphql-tag';

const getInteractionsQuery = gql`
  query getInteractions($dialogueSlug: String!, $customerSlug: String!, $filter: PaginationWhereInput) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        id
        sessionConnection(filter: $filter) {
          sessions {
            id
            createdAt
            paths
            score

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
                choiceNodeEntry
                linkNodeEntry
              }
            }
          }
          pageInfo {
            pageIndex
            nrPages
          }
          startDate
          endDate
        }
      }
    }
  }
`;

export default getInteractionsQuery;
