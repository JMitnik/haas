import gql from 'graphql-tag';

// Classic theme ck6lq5xn7007t0783e0p51lva
// Alternative theme "ck6lzn9bd04370783aywip306"

export const GET_THEME_COLOURS = gql`
  query getTheme ($id: ID) {
      colourSettings(where: {
        id: $id
      }) {
      id
      title
      primary
      secondary
      tertiary
      success
      warning
      error
      lightest
      light
      normal
      dark
      darkest
      muted
      text
  }
}
`;
