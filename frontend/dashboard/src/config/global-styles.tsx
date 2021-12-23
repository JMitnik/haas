import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  #popper_root {
    z-index: 3000;
    position: relative;
  }

  body {
    margin: 0;
    font-family: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    font-family: 'Inter', sans-serif;

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
  
  /* For react-modal */
  .ReactModal__Body--open {
    overflow: hidden;
  }

  @media print {
    @page { margin: 0; }
    body { margin: 1.6cm; }

    #usernav {
      display: none;
    }
  }
`;

export default GlobalStyle;
