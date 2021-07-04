import { gql } from '@apollo/client';

const getDialoguesOfCustomer = gql`
  query getQuestionnairesOfCustomer($customerSlug: String!, $filter: DialogueFilterInputType) {
    customer(slug: $customerSlug) {
      id
      dialogues(filter: $filter) {
        id
        title
        language
        slug
        publicTitle
        creationDate
        updatedAt
        customerId
        averageScore
        customer {
          slug
        }
        tags {
          id
          type
          name
        }
      }
    }
  }
`;

export default getDialoguesOfCustomer;
