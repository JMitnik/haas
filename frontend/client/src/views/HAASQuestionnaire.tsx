import React, { useEffect, useState } from 'react';
import styled, { css, ThemeProvider } from 'styled-components';
import { HAASTreeProvider } from '../hooks/use-haas-tree';
import { HAASForm } from '../components/HAASForm';
import { Switch, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Div, Loader } from '@haas/ui';
import { useQuestionnaire } from '../hooks/use-questionnaire';
import FinalScreen from './FinalScreen';
import { makeCustomTheme } from '../utils/makeCustomerTheme';

const HAASQuestionnaire = () => {
  const { customer } = useQuestionnaire();
  const [customTheme, setCustomTheme] = useState({});
  const location = useLocation();

  console.log('location', location);

  // Customize app for customer
  useEffect(() => {
    if (customer?.name) {
      window.document.title = `${customer.name} | Powered by HAAS`;
    }

    if (customer?.settings) {
      const customerTheme = {colors: customer?.settings?.colourSettings};
      setCustomTheme(customerTheme);
    }
  }, [customer]);

  if (!customer) return <Loader />

  return (
    <>
      <ThemeProvider theme={((theme: any) => makeCustomTheme(theme, customTheme))}>
        <ThemedBackground>
          <HAASTreeProvider>
            <CenteredScreen>
              <AnimatePresence>
                <Switch key={location.pathname}>
                  <Route path="/c/:customerId/q/:questionnaireId/finished" render={() => <FinalScreen />} />
                  <Route path="/" render={() => <HAASForm />} />
                </Switch>
              </AnimatePresence>
            </CenteredScreen>
          </HAASTreeProvider>
        </ThemedBackground>
      </ThemeProvider>
    </>
  );
};

const ThemedBackground = styled(Div)`
  ${({ theme }) => css`
    background: ${theme.colors.primary || 'green'};

    ${theme.colors.primary && theme.colors.primaryAlt && css`
        animation: BackgroundMove 30s ease infinite;
        background: linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryAlt});
    `}


    @-webkit-keyframes BackgroundMove {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
    }
    @-moz-keyframes BackgroundMove {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
    }
    @keyframes BackgroundMove {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
    }

    min-height: 100vh;
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
      margin: 0 ${theme.gutter}px;
    }
  `}
`;

export default HAASQuestionnaire;
