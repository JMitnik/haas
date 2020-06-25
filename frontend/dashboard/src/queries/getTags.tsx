import gql from 'graphql-tag';

const getTagsQuery = gql`
  query getTags($customerSlug: String) {
    tags(customerSlug: $customerSlug) {
      name
      id
      customerId
      type
    }
  }
`;

export default getTagsQuery;
