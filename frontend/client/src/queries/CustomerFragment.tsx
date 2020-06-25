import gql from 'graphql-tag';

export const CustomerFragment = gql`
  fragment CustomerFragment on Customer {
    id
    name
    slug
    settings {
      id
      logoUrl
      colourSettings {
        id
        primary
        primaryAlt
        secondary
      }
    }
    dialogues {
      id
      slug
      description
      title
      publicTitle
    }
  }
`;
