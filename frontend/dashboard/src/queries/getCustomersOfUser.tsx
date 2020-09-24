import gql from 'graphql-tag';

import { CustomerFragment } from './CustomerFragment';

const getCustomersOfUser = gql`
  query getCustomers($userId: String!) {
    user(userId: $userId) {
      customers {
        ...CustomerFragment
      }
    }
  }

  ${CustomerFragment}
`;

export default getCustomersOfUser;
