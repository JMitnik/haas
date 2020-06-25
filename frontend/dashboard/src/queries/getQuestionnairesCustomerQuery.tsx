import gql from 'graphql-tag';

const getQuestionnairesCustomerQuery = gql`
  query getQuestionnairesOfCustomer($customerSlug: String!, $filter: DialogueFilterInputType) {
    customer(slug: $customerSlug) {
      dialogues(filter: $filter) {
        id
        title
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

export default getQuestionnairesCustomerQuery;
