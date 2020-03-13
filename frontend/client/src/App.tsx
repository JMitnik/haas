import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled, { css, ThemeProvider } from 'styled-components';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';

import theme from './config/theme';
import HAASQuestionnaire from './views/HAASQuestionnaire';
import { Div, Loader } from '@haas/ui';
import { CustomerSelector } from './views/CustomerSelector';
import { getCustomerQuery } from './queries/getCustomerQuery';
import { QuestionnaireProvider } from './hooks/use-questionnaire';
import getNewSessionId from './queries/getNewSessionId';
import FinalScreen from './views/FinalScreen';

const App: React.FC = () => {
  const { data, loading, error } = useQuery(getCustomerQuery);
  const customers = data?.customers;

  const { data: newSessionData } = useQuery(getNewSessionId);
  const sessionId = newSessionData?.newSessionId;

  // Initialize unique sessionId
  useEffect(() => {
    if (sessionId) {
      sessionStorage.setItem('sessionId', sessionId);
    }
  }, [sessionId])

  if (error) return <div>{'Error!' + error.message}</div>;

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
