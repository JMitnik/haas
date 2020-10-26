import gql from 'graphql-tag';

import { CustomerFragment } from './CustomerFragment';

const getCustomerFromSlug = gql`
  query getCustomer($slug: String!) {
    customer(slug: $slug) {
        ...CustomerFragment
    }
  }

  ${CustomerFragment}
`;

export default getCustomerFromSlug;
