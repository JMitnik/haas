import gql from 'graphql-tag';

import { CustomerFragment } from './CustomerFragment';

export const getCustomerQuery = gql`
  query getCustomers {
    customers {
      ...CustomerFragment
    }
  }

  ${CustomerFragment}
`;
