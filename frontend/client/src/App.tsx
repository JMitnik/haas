import React, { useState } from 'react';
import styled, { css, ThemeProvider } from 'styled-components';
import theme from './theme';
import Select from 'react-select';
import { FormContext, useForm } from 'react-hook-form';
import { Div } from '@haas/ui';
import { ColumnFlex } from '@haas/ui/src/Container';
import { JSONTreeProvider } from './hooks/use-json-tree';
import { HAASForm } from './HAASForm';

import { useQuery } from '@apollo/react-hooks';

import { GET_QUESTIONNAIRE } from './queries/getQuestionnaire'
import { GET_LEAF_NODES } from './queries/getLeafNodes'

import { GET_THEME_COLOURS } from './queries/getTheme'

const App: React.FC = () => {
  const form = useForm();

  const [currTheme, setCurrTheme] = useState<any>('ck6lq5xn7007t0783e0p51lva')
  const themeData = useQuery<any>(GET_THEME_COLOURS, { variables: { id: currTheme}})
  const leafNodes = useQuery<any>(GET_LEAF_NODES);

  const {
    data,
    loading,
    error
  } = useQuery<any>(GET_QUESTIONNAIRE);

  if (themeData?.data?.colourSettings) {
    const { lightest, light, normal, dark, darkest, muted, text, primary, secondary, tertiary, success, warning, error } = themeData?.data?.colourSettings
    const colours = { 'black': 'black', 'white': 'white', 'primary': primary, 'secondary': secondary, 'tertiary': tertiary, 'success': success, 'warning': warning, 'error': error, default: { 'lightest': lightest, 'light': light, 'normal': normal, 'dark': dark, 'darkest': darkest, 'muted': muted, 'text': text } }
    theme.colors = colours
  }

  const setTheme = (event: any) => {
    event.preventDefault();
    setCurrTheme(event.target?.value)
  }

  const cleanData = data?.questionnaire?.questions;
  const finalData = { questionnaire: cleanData, LeafCollection: leafNodes?.data?.leafNodes };

  if (loading) return <div>'Loading...'</div>;
  if (error) return <div>{'Error!' + error.message}</div>;

  const themeOptions = [
    { value: 'ck6lq5xn7007t0783e0p51lva', label: 'Classic' },
    { value: 'ck6lzn9bd04370783aywip306', label: 'Alternative' },
  ];

  return (
    <>
      <ThemeProvider theme={theme}>
        <MainAppScreen>
          <CenteredScreen>
            <JSONTreeProvider json={finalData}>
              <FormContext {...form}>
                <ColumnFlex alignItems="center">
                  <HAASForm />
                  <DropdownContainer alignSelf="normal" width={1/2} >
                    <Select onChange={(value) => setCurrTheme(value)} options={themeOptions} />
                  </DropdownContainer>
                </ColumnFlex>
              </FormContext>
            </JSONTreeProvider>
          </CenteredScreen>
        </MainAppScreen>
      </ThemeProvider>
    </>
  );
}


const DropdownContainer = styled(Div)`
  position: absolute;
  right: 0;
  bottom: 0;
`;

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

export default App;
