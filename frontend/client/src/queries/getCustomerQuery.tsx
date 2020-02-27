import gql from 'graphql-tag';

export const getCustomerQuery = gql`
  query getCustomers {
    customers {
      id
      name
      settings {
        id
        logoUrl
        colourSettings {
          primary
          secondary
        }
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
