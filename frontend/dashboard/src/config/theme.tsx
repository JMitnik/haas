import { theme as chakraTheme } from '@chakra-ui/core';
import { generatePalette } from 'utils/ColorUtils';

// TODO: Export theme as type
const theme = {
  ...chakraTheme,
  isDarkColor: undefined,
  colors: {
    ...chakraTheme.colors,
    primary: '#426b3a',
    primaryAlt: '#8cb6ff',
    primaries: generatePalette('#426b3a'),
    secondary: '#6f6594',
    tertiary: '#3182CE',
    black: 'black',
    white: 'white',
    success: '#38B2AC',
    warning: '#ECC94B',
    error: '#F56565',
    default: {
      0: '#f7f8fb',
      50: '#eef0f7',
      100: '#ced2e0',
      200: '#adb5cc',
      300: '#8c97ba',
      400: '#6b79a8',
      500: '#536090',
      600: '#404a6f',
      700: '#2e354f',
      800: '#1c202f',
      900: '#090b11',
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
    width: 100,
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

export default theme;
