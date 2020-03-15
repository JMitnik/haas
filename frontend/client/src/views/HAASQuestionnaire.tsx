import React, { useEffect, useState } from 'react';
import styled, { css, ThemeProvider } from 'styled-components';
import { HAASTreeProvider } from '../hooks/use-haas-tree';
import { HAASForm } from '../components/HAASForm';
import { Switch, Route } from 'react-router-dom';
import { Div, Loader } from '@haas/ui';
import { removeEmpty } from '../utils/removeEmpty';
import { useQuestionnaire } from '../hooks/use-questionnaire';
import FinalScreen from './FinalScreen';

const HAASQuestionnaire = () => {
  const { customer } = useQuestionnaire();
  const [customTheme, setCustomTheme] = useState({});

  useEffect(() => {
    window.document.title = `${customer.name} | Powered by HAAS`
  }, [customer]);

  useEffect(() => {
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
              <Switch>
                <Route path="/finished" render={() => <FinalScreen />} />
                <Route path="/" render={() => <HAASForm />} />
              </Switch>
            </CenteredScreen>
          </HAASTreeProvider>
        </ThemedBackground>
      </ThemeProvider>
    </>
  );
};

const ThemedBackground = styled(Div)`
  ${({ theme }) => css`
    background: ${theme.colors.primary};
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

const makeCustomTheme = (currTheme: any, customTheme: any) => {
  const colors = {...currTheme?.colors, ...removeEmpty({...customTheme?.colors})};
  const newTheme = {...currTheme, colors};

  return newTheme;
};

export default HAASQuestionnaire;
