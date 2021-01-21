import { gql } from '@apollo/client';

const getDialogueSessionConnectionQuery = gql`
  query getDialogueSessionConnection($dialogueSlug: String!, $customerSlug: String!, $filter: PaginationWhereInput) {
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
            originUrl
            totalTimeInSec
            device

            delivery {
              id
              deliveryRecipientFirstName
            }

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
                formNodeEntry {
                  id
                  values {
                    relatedField {
                      id
                      type
                    }

                    email
                    phoneNumber
                    url
                    shortText
                    longText
                    number
                  }
                }
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

export default getDialogueSessionConnectionQuery;
