import React, { FC } from 'react';
import styled, { ThemeProvider, css } from 'styled-components'
import theme from './config/theme';
import SideNav from './components/UI/Nav';
import GlobalStyle from './config/global-styles';
import { BrowserRouter as Router } from 'react-router-dom';

const AppContainer = styled.div`
  display: grid;
  background: blue;
  grid-template-columns: 200px 1fr;
  min-height: 1vh;
`;

const MainWindow = styled.div`
  ${({ theme }) => css`
    padding: ${theme.gutter}px;
    background: ${theme.defaultColors.normal};
    min-height: 100vh;
  `}
`;

const App: FC = () => (
  <>
    <Router>
      <ThemeProvider theme={theme}>
        <AppContainer>
          <SideNav />

          {/* Routes */}
          <MainWindow>
            App
          </MainWindow>
        </AppContainer>
        <GlobalStyle />
      </ThemeProvider>
    </Router>
  </>
);

export default App;
