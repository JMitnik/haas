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
      50: '#eef0f9',
      100: '#dee1f4',
      200: '#bdc2e8',
      300: '#9ba4dd',
      400: '#7a85d1',
      500: '#5967c6',
      600: '#47529e',
      700: '#353e77',
      800: '#24294f',
      900: '#121528',
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
      100: '#f1f4ff',
      200: '#eff3ff',
      300: '#d7dbe6',
      400: '#bfc2cc',
      500: '#a7aab3',
      600: '#8f9299',
      700: '#787a80',
      800: '#606166',
      900: '#48494c',
    },
    strongPrimary: '#8cb6ff',
    primaryGradient: undefined,
    secondary: '#6f6594',
    tertiary: '#3182CE',
    black: 'black',
    white: 'white',
    success: '#38B2AC',
    warning: '#ECC94B',
    error: '#F56565',
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
    body: '',
    title: '',
    special: '',
  },
  sidenav: {
    // Note-sidenav: uncomment to get back old sidenav
    // width: 200,
    width: 220,
  },
  // zIndices: {
  //   dropdown: 200,
  // },
  fontSizes: [8, 12, 22, 28, 36, 48],
  buttonSizes: {
    sm: '8px 12px',
    md: '9px 14px',
    lg: '18px 24px',
  },
  borderRadiuses: {
    sm: '3px',
    md: '7px',
    lg: '20px',
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
};

export const chakraDefaultTheme = {
  ...theme,
  space: chakraTheme.space,
  fontSizes: chakraTheme.fontSizes,
};

// Dependent variables - Generic
theme.colors.app.background = theme.colors.default.normal;
theme.colors.app.sidebar = theme.colors.white;

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
