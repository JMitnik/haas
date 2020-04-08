import gql from 'graphql-tag';

const getQuestionnairesCustomerQuery = gql`
  query getQuestionnairesOfCustomer($id: ID) {
  questionnaires(where: { customer: {
  id: $id 
  } }) {
    id
    title
    publicTitle
    creationDate
    updatedAt
    customer {
      id
    }
  }
}
`;

export default getQuestionnairesCustomerQuery;
