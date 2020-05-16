import gql from 'graphql-tag';

const getEditCustomerData = gql`
  query getEditCustomer($id: ID!) {
    customer(id: $id) {
      id
      name
      slug
      settings {
      logoUrl
      colourSettings {
        primary
      }
    }
    }
  }
`;

export default getEditCustomerData;
