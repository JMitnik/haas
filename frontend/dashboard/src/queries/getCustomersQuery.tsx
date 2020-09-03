import gql from 'graphql-tag';

import { CustomerFragment } from './CustomerFragment';

const getCustomerQuery = gql`
  query getCustomers($userId: String!) {
    user(userId: $userId) {
      customers {
        ...CustomerFragment
      }
    }
  }

  ${CustomerFragment}
`;

export default getCustomerQuery;
