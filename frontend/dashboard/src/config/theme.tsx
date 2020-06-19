// TODO: Export theme as type
const theme = {
  colors: {
    primary: '#426b3a',
    primaryAlt: '#8cb6ff',
    secondary: '#6f6594',
    tertiary: 'green',
    black: 'black',
    white: 'white',
    success: '#38B2AC',
    warning: '#ECC94B',
    error: '#F56565',
    default: {
      lightest: '#f7faff',
      light: '#eef1f5',
      normal: '#f7f8fb',
      dark: '#afb4c6',
      darker: '#8e919d',
      darkest: '#5f6167',
      muted: '#59759c',
      text: '#4f5d6e',
    },
    app: {
      sidebar: '',
      background: '',
      onWhite: '',
      mutedOnWhite: '',
      mutedAltOnWhite: '',
    },
  },
  space: [0, 6, 12, 18, 24],
  gutter: 24,
  containerWidth: 1080,
  // TODO: Add
  fontFamilies: {
    body: '',
    title: '',
    special: '',
  },
  sidenav: {
    width: 230,
  },
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
    rounded: '50px',
  },
};

// Dependent variables - Generic
theme.colors.app.background = theme.colors.default.normal;
theme.colors.app.sidebar = theme.colors.white;

// Dependent variables - colors on white
theme.colors.app.onWhite = theme.colors.default.darkest;
theme.colors.app.mutedOnWhite = theme.colors.default.dark;
theme.colors.app.mutedAltOnWhite = theme.colors.default.darker;

export default theme;
