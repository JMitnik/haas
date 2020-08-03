import gql from 'graphql-tag';

const editCustomerMutation = gql`
  mutation editCustomer($id: String!, $options: CustomerEditOptions) {
    editCustomer(id: $id, options: $options) {
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
