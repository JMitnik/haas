import gql from 'graphql-tag';

import { CustomerFragment } from './CustomerFragment';

const getCustomerFromSlug = gql`
  query customer($slug: String!) {
    customer(slug: $slug) {
        ...CustomerFragment
    }
  }

  ${CustomerFragment}
`;

export default getCustomerFromSlug;
