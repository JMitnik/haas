import gql from 'graphql-tag';

const getQuestionnairesCustomerQuery = gql`
  query getQuestionnairesOfCustomer($id: ID!, $filter: DialogueFilterInputType) {
    dialogues(customerId: $id, filter: $filter) {
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
`;

export default getQuestionnairesCustomerQuery;
