import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Raleway:300,400,700&display=swap');

  body, html, * {
      /* font-family: 'Open Sans', sans-serif; */
      font-family: 'Raleway', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }

  svg {
      display: block;
  }
`;

export default GlobalStyle;
