import { gql } from '@apollo/client';

const getEditCustomerData = gql`
  query getEditCustomer($customerSlug: String!) {
    customer(slug: $customerSlug) {
      id
      name
      slug
      settings {
        logoUrl
        logoOpacity
        colourSettings {
          primary
        }
      }
    }
  }
`;

export default getEditCustomerData;
