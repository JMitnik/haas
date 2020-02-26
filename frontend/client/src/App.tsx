import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled, { css, ThemeProvider } from 'styled-components';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';

import theme from './config/theme';
import { FormContext, useForm } from 'react-hook-form';
import { Div, Loader } from '@haas/ui';
import { ColumnFlex } from '@haas/ui/src/Container';
import { JSONTreeProvider } from './hooks/use-json-tree';
import { HAASForm } from './components/HAASForm';
import { CustomerSelector } from './components/CustomerSelector';
import { getCustomerQuery } from './queries/getCustomerQuery';

const App: React.FC = () => {
  const form = useForm();

  const { data, loading, error } = useQuery(getCustomerQuery);
  if (error) return <div>{'Error!' + error.message}</div>;

  const customers = data?.customers;

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <MainAppScreen>
            <CenteredScreen>
              {loading ? <Loader/> : (
                <FormContext {...form}>
                    <ColumnFlex alignItems="center">
                      <Switch>
                        <Route path="/c/:customerId/q/:questionnaireId">
                          <JSONTreeProvider>
                            <HAASForm />
                          </JSONTreeProvider>
                        </Route>
                        <Route path="/c/">
                          <Redirect to="/" />
                        </Route>
                        <Route path="/">
                          <CustomerSelector customers={customers} />
                        </Route>
                      </Switch>
                    </ColumnFlex>
                  </FormContext>
              )}
            </CenteredScreen>
          </MainAppScreen>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

const MainAppScreen = styled(Div)`
  ${({ theme }) => css`
    min-width: 100vw;
    min-height: 100vh;
    background: ${theme.colors.primary};
    background-size: 400% 400%;

    @media ${theme.media.mob} {
      padding: 0 ${theme.gutter}px;
    }
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

export default App;
