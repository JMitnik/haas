/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

export const deleteFullCustomerQuery = gql`
  mutation deleteFullCustomer($id: ID!) {
    deleteCustomer(where: { id: $id }) {
      id
    }
}
`;
