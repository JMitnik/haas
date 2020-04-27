import gql from 'graphql-tag';

const getQuestionnairesCustomerQuery = gql`
  query getQuestionnairesOfCustomer($id: String) {
  dialogues(customerId: $id) {
    id
    title
    publicTitle
    creationDate
    updatedAt
    customerId
  }
}
`;

export default getQuestionnairesCustomerQuery;
