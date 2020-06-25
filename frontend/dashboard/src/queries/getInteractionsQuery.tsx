import gql from 'graphql-tag';

const getInteractionsQuery = gql`
  query getInteractions($dialogueSlug: String!, $customerSlug: String!, $filter: FilterInput) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        id
        interactions(filter: $filter) {
          sessions {
            id
            createdAt
            paths
            score
            index
            nodeEntries {
              id
              depth
              relatedNode {
                title
                type
              }
              values {
                numberValue
                textValue
                multiValues {
                  textValue
                  numberValue
                }
              }
            }
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
    }
  }
`;

export default getInteractionsQuery;
