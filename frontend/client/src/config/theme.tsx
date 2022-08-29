import { theme as chakraTheme } from '@chakra-ui/core';

const theme = {
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
    main: {
      50: '#eceefa',
      100: '#d8ddf5',
      150: '#c5cdf0',
      200: '#b1bceb',
      250: '#9eabe6',
      300: '#8b9ae0',
      350: '#7789db',
      400: '#6479d6',
      450: '#5068d1',
      500: '#3d57cc',
      550: '#374eb8',
      600: '#3146a3',
      650: '#2b3d8f',
      700: '#25347a',
      750: '#1f2c66',
      800: '#182352',
      850: '#121a3d',
      900: '#0c1129',
      950: '#060914',
    },
    off: {
      50: '#ffffff',
      100: '#e1e2ec',
      200: '#c3c5d8',
      300: '#a6a7c5',
      400: '#888ab1',
      500: '#6a6d9e',
      600: '#55577e',
      700: '#40415f',
      800: '#2a2c3f',
      900: '#151620',
    },
    default: {
      lightest: '#f5f7fa',
      light: '#eef1f5',
      normal: '#d4dcea',
      dark: '#657590',
      darkest: '#17263d',
      muted: '#59759c',
      text: '#030426',
    },
    neutral: {
      50: '#FDFEFF',
      100: '#FCFDFF',
      150: '#FAFBFF',
      200: '#F9FAFF',
      250: '#F7F9FF',
      300: '#F5F8FF',
      350: '#F4F7FF',
      400: '#F2F5FF',
      450: '#F1F4FF',
      500: '#EFF3FF',
      550: '#D7DBE6',
      600: '#BFC2CC',
      650: '#A7AAB3',
      700: '#8F9299',
      750: '#787A80',
      800: '#606166',
      850: '#48494C',
      900: '#303133',
      950: '#181819',
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
    sm: 5,
    md: 10,
    lg: 20,
    subtleRounded: '3px',
    somewhatRounded: '10px',
    rounded: '50px',
  },
  boxShadows: {
    sm: 'var(--shadow-elevation-low)',
    md: '0px 2px 5px -1px rgba(50, 50, 93, 0.25), 0px 1px 3px -1px rgba(0, 0, 0, 0.3)',
    lg: 'var(--shadow-elevation-high)',
  },
  media: {
    mob: 'only screen and (max-width: 600px)',
    desk: 'only screen and (min-width: 601px)',
  },
  fontSizes: [12, 16.0, 21.33, 28.43, 37.9, 50.52],
  transitions: {
    slow: '0.2s ease-in-out',
    normal: '0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

export const chakraDefaultTheme = {
  ...theme,
  space: chakraTheme.space,
  fontSizes: chakraTheme.fontSizes,
};

theme.colors.app.background = theme.colors.default.normal;

export default theme;
