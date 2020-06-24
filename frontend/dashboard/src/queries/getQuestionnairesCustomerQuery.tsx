import gql from 'graphql-tag';

const getQuestionnairesCustomerQuery = gql`
  query getQuestionnairesOfCustomer($id: ID!, $filter: DialogueFilterInputType) {
  dialogues(customerId: $id, filter: $filter) {
    id
    title
    publicTitle
    creationDate
    updatedAt
    customerId
    averageScore
    tags {
      id
      type
      name
    }
  }
}
`;

export default getQuestionnairesCustomerQuery;
