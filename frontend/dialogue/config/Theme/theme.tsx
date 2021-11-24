import { theme as chakraTheme } from '@chakra-ui/core';

export const theme = {
  ...chakraTheme,
  colors: {
    ...chakraTheme.colors,
    primary: '#0059f8',
    secondary: '#4FD1C5',
    tertiary: 'green',
    black: 'black',
    white: 'white',
    success: '#38B2AC',
    warning: '#ECC94B',
    error: '#F56565',
    default: {
      lightest: '#f5f7fa',
      light: '#eef1f5',
      normal: '#d4dcea',
      dark: '#657590',
      darkest: '#17263d',
      muted: '#59759c',
      text: '#030426',
    },
    app: {
      background: '',
    },
  },
  space: [0, 6, 12, 18, 24],
  gutter: 24,
  containerWidth: 760,
  // TODO: Add font
  fontFamilies: {
    body: '',
    title: '',
    special: '',
  },
  buttonSizes: {
    sm: '4px 6px',
    md: '9px 14px',
    lg: '18px 24px',
  },
  borderRadiuses: {
    sm: '3px',
    md: '7px',
    lg: '20px',
  },
  media: {
    mob: 'only screen and (max-width: 600px)',
    desk: 'only screen and (min-width: 601px)',
  },
  fontSizes: [12, 16.0, 21.33, 28.43, 37.9, 50.52],
};

export const chakraDefaultTheme = {
  ...theme,
  space: chakraTheme.space,
  fontSizes: chakraTheme.fontSizes,
};

export type Theme = typeof theme;

theme.colors.app.background = theme.colors.default.normal;
