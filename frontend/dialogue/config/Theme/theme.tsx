import { theme as chakraTheme } from '@chakra-ui/core';


export interface Shades {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;

}

const defaultTheme = {
  ...chakraTheme,
  space: chakraTheme.space,
  fontSizes: chakraTheme.fontSizes,
  colors: {
    ...chakraTheme.colors,
    primary: {} as Shades,
    _primary: '#0059f8',
    secondary: '#4FD1C5',
    _secondary: '#4FD1C5',
    tertiary: 'green',
    _tertiary: 'green',
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
};

export const themeWithChakra = {
  ...defaultTheme,
};


export enum ThemeBrightModeEnum {
  light = 'light',
  dark = 'dark',
  medium = 'medium',
}
type Chakratheme = typeof themeWithChakra;

export interface Theme extends Chakratheme {
  brightMode: ThemeBrightModeEnum;
}
export const theme: Theme = {
  ...themeWithChakra,
  brightMode: ThemeBrightModeEnum.medium,
}

theme.colors.app.background = theme.colors.default.normal;
