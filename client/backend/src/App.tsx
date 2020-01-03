import React, { FC } from 'react';
import { ThemeProvider } from 'styled-components'
import AppContainer from './views/AppContainer';
import theme from './config/theme';

const App: FC = () => (
  <ThemeProvider theme={theme}>
    <AppContainer>
      Test2
    </AppContainer>
  </ThemeProvider>
);
  
export default App;
