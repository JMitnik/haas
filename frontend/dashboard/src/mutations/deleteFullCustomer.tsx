/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const deleteFullCustomerQuery = gql`
  mutation deleteFullCustomer($id: ID!) {
    deleteFullCustomer(id: $id) {
      id
    }
}
`;
