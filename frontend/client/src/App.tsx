import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled, { css, ThemeProvider } from 'styled-components';
import gql from 'graphql-tag';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';

import theme from './config/theme';
import { FormContext, useForm } from 'react-hook-form';
import { Div, Loader } from '@haas/ui';
import { ColumnFlex } from '@haas/ui/src/Container';
import { JSONTreeProvider } from './hooks/use-json-tree';
import { HAASForm } from './components/HAASForm';
import { CustomerSelector } from './components/CustomerSelector';
import { GET_LEAF_NODES } from './queries/getLeafNodes';
import { getCustomerQuery } from './queries/getCustomerQuery';

const App: React.FC = () => {
  const form = useForm();

  const leafNodes = useQuery<any>(GET_LEAF_NODES);
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
  ${() => css`
    min-width: 100vw;
    min-height: 100vh;
    /* TODO: Make something out of this */
    background: linear-gradient(270deg, #0059f8, #091a32);
    animation: MovingBackground 20s ease infinite;
    background-size: 400% 400%;

    @keyframes MovingBackground {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
    }

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
