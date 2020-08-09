import gql from 'graphql-tag';

import { CustomerFragment } from './CustomerFragment';

const getCustomerQuery = gql`
  query getCustomers {
    customers {
      ...CustomerFragment
    }
  }

  ${CustomerFragment}
`;

export default getCustomerQuery;
