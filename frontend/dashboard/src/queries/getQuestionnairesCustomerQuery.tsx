import gql from 'graphql-tag';

const getQuestionnairesCustomerQuery = gql`
  query getQuestionnairesOfCustomer($id: ID!) {
  dialogues(customerId: $id) {
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
