/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const createNewCustomer = gql`
  mutation createNewCustomer($name: String!, $options: CustomerCreateOptions) {
    createCustomer(name: $name, options: $options) {
        name
      }
  }
`;
