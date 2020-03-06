import React, { useEffect, useState } from 'react';
import styled, { css, ThemeProvider } from 'styled-components';
import { JSONTreeProvider } from '../hooks/use-json-tree';
import { HAASForm } from '../components/HAASForm';
import { Div, Loader } from '@haas/ui';
import { removeEmpty } from '../utils/removeEmpty';
import { useQuestionnaire } from '../hooks/use-questionnaire';

const HAASQuestionnaire = () => {
  const { customer } = useQuestionnaire();
  const [customTheme, setCustomTheme] = useState({});

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
          <JSONTreeProvider>
            <CenteredScreen>
              <HAASForm />
            </CenteredScreen>
          </JSONTreeProvider>
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
