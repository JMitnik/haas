import gql from 'graphql-tag';

const getTagsQuery = gql`
  query getTags($customerId: String) {
    tags(customerId: $customerId) {
        name
        id
        customerId
        type
    }
  }
`;

export default getTagsQuery;
