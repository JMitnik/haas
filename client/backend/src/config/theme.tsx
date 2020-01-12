// TODO: Export theme as type

const theme = {
  colors: {
    primary: '#452f94',
    secondary: '#38E6FA',
    tertiary: 'green',
    black: 'black',
    white: 'white',
    success: '#38B2AC',
    warning: '#ECC94B',
    error: '#F56565',
    default: {
      light: '#a4aeb7',
      normal: '#f5f6f8',
      background: '#f5f7fa',
      alt: '#EBEEFF',
      footer: '#f4f7fa',
      muted: '#59759c',
      text: '#4f5d6e',
    },
    text: {
      black: '#122840',
    },
  },
  space: [0, 6, 12, 18, 24],
  gutter: 24,
  containerWidth: 1080,
  // TODO: Add font
  fontFamilies: {
    body: '',
    title: '',
    special: '',
  },
  buttonSizes: {
    sm: '8px 12px',
    md: '16px 24px',
    lg: '18px 24px',
  },
  borderRadiuses: {
    sm: '3px',
    md: '7px',
    lg: '20px',
  },
};

export default theme;
