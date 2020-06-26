import gql from 'graphql-tag';

const getEditCustomerData = gql`
  query getEditCustomer($customerSlug: String!) {
    customer(slug: $customerSlug) {
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
