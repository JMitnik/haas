// TODO: Export theme as type

const theme = {
  colors: {
    primary: '#0866fd',
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
      normal: '#d4dcea',
      dark: '#657590',
      darkest: '#17263d',
      muted: '#59759c',
      text: '#4f5d6e',
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
  nav: {
    height: 80,
  },
  fontSizes: [8, 12, 16, 18, 24, 32],
  buttonSizes: {
    sm: '8px 12px',
    md: '9px 14px',
    lg: '18px 24px',
  },
  borderRadiuses: {
    sm: '3px',
    md: '7px',
    lg: '20px',
  },
};

export default theme;
