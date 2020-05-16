import gql from 'graphql-tag';

const editCustomerMutation = gql`
  mutation editCustomer($id: String!, $options: CustomerCreateOptions) {
    editCustomer(id: $id, options: $options) {
        id
    }
  }
`;

export default editCustomerMutation;
