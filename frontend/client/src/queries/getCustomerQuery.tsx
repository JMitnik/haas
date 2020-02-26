import gql from 'graphql-tag';

export const getCustomerQuery = gql`
  query getCustomers {
    customers {
      id
      name
      settings {
        id
        logoUrl
      }
      questionnaires {
        id
        description
        title
        publicTitle
      }
    }
  }
`;
