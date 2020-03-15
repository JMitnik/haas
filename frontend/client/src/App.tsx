import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled, { css, ThemeProvider } from 'styled-components';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';

import theme from './config/theme';
import HAASQuestionnaire from './views/HAASQuestionnaire';
import { Div, Loader } from '@haas/ui';
import { CustomerSelector } from './views/CustomerSelector';
import { getCustomerQuery } from './queries/getCustomerQuery';
import { QuestionnaireProvider } from './hooks/use-questionnaire';

const App: React.FC = () => {
  const { data, loading, error } = useQuery(getCustomerQuery);
  if (error) return <div>{'Error!' + error.message}</div>;

  
  const customers = data?.customers;

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <MainAppScreen>
              {loading ? <Loader/> : (
                <Switch>
                  <Route path="/c/:customerId/q/:questionnaireId">
                    <QuestionnaireProvider>
                      <HAASQuestionnaire />
                    </QuestionnaireProvider>
                  </Route>
                  <Route path="/c/">
                    <Redirect to="/" />
                  </Route>
                  <Route path="/">
                    <CustomerSelector customers={customers} />
                  </Route>
                </Switch>
              )}
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
  `}
`;

export default App;
