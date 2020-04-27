import gql from 'graphql-tag';

export const CustomerFragment = gql`
  fragment CustomerFragment on Customer {
    id
    name
    settings {
      logoUrl
      colourSettings {
        primary
        primaryAlt
        secondary
      }
    }
    dialogues {
      id
      description
      title
      publicTitle
    }
  }
`;
