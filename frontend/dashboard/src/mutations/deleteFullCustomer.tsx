/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const deleteFullCustomerQuery = gql`
 mutation deleteCustomer($id: ID!) {
  deleteCustomer(where: {
    id: $id
  }) {
  id
  }
}

`;
