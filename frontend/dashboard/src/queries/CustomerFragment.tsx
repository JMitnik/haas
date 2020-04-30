/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const CustomerFragment = gql`
  fragment CustomerFragment on Customer {
    id
    name
    settings {
      logoUrl
      colourSettings {
        primary
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
