import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --shadow-color: 200deg 12% 76%;
    --shadow-elevation-low:
      -0.5px 0.8px 0.8px hsl(var(--shadow-color) / 0.3),
      -0.7px 1px 1.1px -2px hsl(var(--shadow-color) / 0.23),
      -1.5px 2.4px 2.5px -4px hsl(var(--shadow-color) / 0.15);
    --shadow-elevation-medium:
      -0.5px 0.8px 0.8px hsl(var(--shadow-color) / 0.25),
      -0.8px 1.3px 1.4px -1px hsl(var(--shadow-color) / 0.21),
      -1.7px 2.6px 2.8px -2px hsl(var(--shadow-color) / 0.18),
      -3.7px 5.8px 6.2px -3px hsl(var(--shadow-color) / 0.14),
      -7.7px 12px 12.8px -4px hsl(var(--shadow-color) / 0.1);
    --shadow-elevation-high:
      -0.5px 0.8px 0.8px hsl(var(--shadow-color) / 0.26),
      -1px 1.5px 1.6px -0.5px hsl(var(--shadow-color) / 0.24),
      -1.7px 2.6px 2.8px -1px hsl(var(--shadow-color) / 0.22),
      -2.9px 4.5px 4.8px -1.5px hsl(var(--shadow-color) / 0.2),
      -4.9px 7.6px 8.1px -2px hsl(var(--shadow-color) / 0.17),
      -8.1px 12.6px 13.5px -2.5px hsl(var(--shadow-color) / 0.15),
      -12.7px 19.8px 21.2px -3px hsl(var(--shadow-color) / 0.13),
      -19.2px 29.8px 31.9px -3.5px hsl(var(--shadow-color) / 0.11),
      -27.7px 43.1px 46.1px -4px hsl(var(--shadow-color) / 0.09);
  }

  #popper_root {
    z-index: 3000;
    position: relative;
  }

  @font-face {
    font-family: 'Inter';
    src: url('/assets/fonts/inter/Inter.ttf') format('ttf'),
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
