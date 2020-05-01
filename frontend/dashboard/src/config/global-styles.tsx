import { createGlobalStyle } from 'styled-components/macro';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "SF Pro";
    font-weight: 400;
    src: local('SF Pro'), url("/assets/fonts/sfpro.ttf");
  }

  body {
    margin: 0;
    font-family: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    font-family: 'SF Pro' ;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body, html, * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  svg {
      display: block;
  }
`;

export default GlobalStyle;
