/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

interface IOptions {
  logo: string;
  useSeed: Boolean;
}

export const createNewCustomer = gql`
  mutation createNewCustomer($name: String!, $options: CustomerCreateOptions) {
    createNewCustomer(name: $name, options: $options) {
        name
      }
  }
`;
