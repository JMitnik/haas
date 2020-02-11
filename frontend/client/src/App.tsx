import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled, { css, ThemeProvider } from 'styled-components';
import theme from './theme';
import { FormContext, useForm } from 'react-hook-form';
import { Div } from '@haas/ui';
import { ColumnFlex } from '@haas/ui/src/Container';
import flow from './flow.json';
import { JSONTreeProvider }  from './hooks/use-json-tree';
import { HAASForm } from './HAASForm';
import whyDidYouRender from '@welldone-software/why-did-you-render';
whyDidYouRender(React);

const MainAppScreen = styled(Div)`
  ${({ theme }) => css`
    min-width: 100vw;
    min-height: 100vh;
    background: ${theme.colors.primary};
  `}
`;

const CenteredScreen = styled(Div)`
  ${({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    position: relative;
    padding-top: 100px;

    @media ${theme.media.mob} {
      padding-top: 0;
    }
  `}
`;

const App: React.FC = () => {
  const form = useForm();
  const data = flow;

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <MainAppScreen>
            <CenteredScreen>
              <JSONTreeProvider json={data}>
                <FormContext {...form}>
                  <ColumnFlex alignItems="center">
                    <HAASForm />
                  </ColumnFlex>
                </FormContext>
              </JSONTreeProvider>
            </CenteredScreen>
          </MainAppScreen>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
