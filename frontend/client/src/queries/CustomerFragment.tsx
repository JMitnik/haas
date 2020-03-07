import gql from 'graphql-tag';

export const CustomerFragment = gql`
  fragment CustomerFragment on Customer {
    name
    settings {
      logoUrl
      colourSettings {
        primary
        secondary
      }
    }
  }
`;
