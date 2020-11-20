import gql from 'graphql-tag';

const getCustomerFromSlug = gql`
  query getCustomer($slug: String!) {
    customer(slug: $slug) {
      id
    name
    slug
    settings {
      id
      logoUrl
      colourSettings {
        id
        primary
        primaryAlt
        secondary
      }
    }
    }
  }
`;

export default getCustomerFromSlug;
