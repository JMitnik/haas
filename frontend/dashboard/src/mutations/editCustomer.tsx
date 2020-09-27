import gql from 'graphql-tag';

const editCustomerMutation = gql`
  mutation editCustomer($customerId: String!, $options: CustomerEditOptions) {
    editCustomer(customerId: $customerId, options: $options) {
        id
        name
        slug
        settings {
          logoUrl
          colourSettings {
          primary
        }
      }
    }
  }
`;

export default editCustomerMutation;
