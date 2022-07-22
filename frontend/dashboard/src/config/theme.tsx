/* eslint-disable prefer-destructuring */
import { theme as chakraTheme } from '@chakra-ui/core';
import { generatePalette } from 'utils/ColorUtils';

const breakpoints = ['40em', '52em', '64em'];

// TODO: Export theme as type
const theme = {
  ...chakraTheme,
  isDarkColor: undefined,
  colors: {
    ...chakraTheme.colors,
    primary: '#426b3a',
    primaryAlt: '#8cb6ff',
    primaries: generatePalette('#426b3a'),
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
    green: {
      50: '#EBF8F5',
      100: '#D7F0EB',
      150: '#C2E9E2',
      200: '#AEE2D8',
      250: '#9ADBCE',
      300: '#86D3C4',
      350: '#72CCBA',
      400: '#5DC5B1',
      450: '#49BDA7',
      500: '#35B69D',
      550: '#30A48D',
      600: '#2A927E',
      650: '#257F6E',
      700: '#206D5E',
      750: '#1B5B4F',
      800: '#15493F',
      850: '#10372F',
      900: '#0B241F',
      950: '#051210',
    },
    strongPrimary: '#8cb6ff',
    primaryGradient: undefined,
    mainGradient: 'linear-gradient(180deg, #90A2F3 0%, #6074CC 100%);',
    secondary: '#6f6594',
    tertiary: '#3182CE',
    black: 'black',
    white: 'white',
    success: '#38B2AC',
    warning: '#ECC94B',
    error: '#F56565',
    red: {
      50: '#feedf1',
      100: '#fddbe4',
      150: '#fdc9d6',
      200: '#fcb7c9',
      250: '#fba5bb',
      300: '#fa92ad',
      350: '#f980a0',
      400: '#f96e92',
      450: '#f85c85',
      500: '#f74a77',
      550: '#de436b',
      600: '#c63b5f',
      650: '#ad3453',
      700: '#942c47',
      750: '#7c253c',
      800: '#631e30',
      850: '#4a1624',
      900: '#310f18',
      950: '#19070c',
    },
    altGray: {
      50: '#edf2f7',
      100: '#cedae2',
      200: '#aec3d0',
      300: '#8cafbf',
      400: '#6b9dae',
      500: '#538895',
      600: '#416d74',
      700: '#2f5051',
      800: '#1c3131',
      900: '#081211',
    },
    default: {
      0: '#ffffff',
      50: '#f6f7f9',
      100: '#eceff2 ',
      200: '#d9dfe6',
      300: '#c6ced9',
      400: '#b3becd',
      500: '#a0aec0',
      600: '#a0aec0',
      700: '#808b9a',
      800: '#606873',
      900: '#40464d',
      lightest: '#f7faff',
      light: '#eef1f5',
      normal: '#f7f8fb',
      normalAlt: '#e6ecf4',
      dark: '#afb4c6',
      darker: '#8e919d',
      darkest: '#444',
      muted: '#59759c',
      text: '#4f5d6e',
    },
    app: {
      topbar: '',
      sidebar: '',
      background: '',
      onWhite: '',
      mutedOnWhite: '',
      mutedAltOnWhite: '',
      onDefault: '',
      mutedOnDefault: '',
      mutedAltOnDefault: '',
    },
  },
  space: [0, 6, 12, 18, 24],
  gutter: 24,
  containerWidth: 1400,
  // TODO: Add
  fontFamilies: {
    body: 'Lato, sans-serif',
    title: '',
    special: '',
  },
  sidenav: {
    // Note-sidenav: uncomment to get back old sidenav
    // width: 200,
    width: 250,
  },
  // zIndices: {
  //   dropdown: 200,
  // },
  fontSizes: [8, 14, 20, 24, 32, 40],
  buttonSizes: {
    sm: '8px 12px',
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
  mediaQueries: {
    small: `@media screen and (min-width: ${breakpoints[0]})`,
    medium: `@media screen and (min-width: ${breakpoints[1]})`,
    large: `@media screen and (min-width: ${breakpoints[2]})`,
  },
  mediaSizes: {
    sm: 0,
    md: 768,
    lg: 1280,
  },
  boxShadows: {
    sm: 'var(--shadow-elevation-low)',
    md: '0px 2px 5px -1px rgba(50, 50, 93, 0.25), 0px 1px 3px -1px rgba(0, 0, 0, 0.3)',
    lg: 'var(--shadow-elevation-high)',
  },
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

// Dependent variables - Generic
theme.colors.app.background = theme.colors.neutral[400];
theme.colors.app.sidebar = theme.colors.neutral[300];
theme.colors.app.topbar = theme.colors.white;

// Dependent variables - colors on white
theme.colors.app.onWhite = theme.colors.default.darkest;
theme.colors.app.mutedOnWhite = theme.colors.default.dark;
theme.colors.app.mutedAltOnWhite = theme.colors.default.darker;

// Dependent variables - colors on muted
theme.colors.app.onDefault = theme.colors.default.darkest;
theme.colors.app.mutedOnDefault = theme.colors.default.normalAlt;
theme.colors.app.mutedAltOnDefault = theme.colors.default.darker;

export type Brand = keyof typeof chakraTheme.colors;

export default theme;
