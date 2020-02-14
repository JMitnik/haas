import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled, { css, ThemeProvider } from 'styled-components';
import theme from './theme';
import { FormContext, useForm } from 'react-hook-form';
import { Div } from '@haas/ui';
import { ColumnFlex } from '@haas/ui/src/Container';
import flow from './flow.json';
import { JSONTreeProvider } from './hooks/use-json-tree';
import { HAASForm } from './HAASForm';
import whyDidYouRender from '@welldone-software/why-did-you-render';

import { useQuery } from '@apollo/react-hooks';

import { GET_QUESTIONNAIRE } from './queries/getQuestionnaire'
import { GET_LEAF_NODES } from './queries/getLeafNodes'

import { GET_THEME_COLOURS } from './queries/getTheme'

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
  // const data = JSON.parse(JSON.stringify(flow));
  const [currTheme, setCurrTheme] = useState('ck6lq5xn7007t0783e0p51lva') 
  const themeData = useQuery<any>(GET_THEME_COLOURS, { variables: { id: currTheme}})

  const leafNodes = useQuery<any>(GET_LEAF_NODES)

  const {
    data,
    loading,
    error
  } = useQuery<any>(GET_QUESTIONNAIRE);



  if (themeData?.data?.colourSettings) {
    const { lightest, light, normal, dark, darkest, muted, text, primary, secondary, tertiary, success, warning, error } = themeData?.data?.colourSettings
    const colours = { 'black': 'black', 'white': 'white', 'primary': primary, 'secondary': secondary, 'tertiary': tertiary, 'success': success, 'warning': warning, 'error': error, default: { 'lightest': lightest, 'light': light, 'normal': normal, 'dark': dark, 'darkest': darkest, 'muted': muted, 'text': text } }
    // console.log('lightest: ', lightest)
    // const defaultValues = {'lightest': lightest, 'light': light, 'normal': normal, 'dark': dark, 'darkest': darkest, 'muted': muted, 'text': text}
    // colours.default = defaultValues
    theme.colors = colours
  }

  function setTheme(event: any) {
    event.preventDefault();
    setCurrTheme(event.target.value)
  }

  console.log('New theme colours: ', theme)

  const cleanData = data?.questionnaire?.questions;
  const finalData = { questionnaire: cleanData, LeafCollection: leafNodes?.data?.leafNodes };

  if (loading) return <div>'Loading...'</div>;
  if (error) return <div>{'Error!' + error.message}</div>;

  return (
    <>
      <ThemeProvider theme={theme}>
        <MainAppScreen>
          <CenteredScreen>
            <JSONTreeProvider json={finalData}>
              <FormContext {...form}>
                <ColumnFlex alignItems="center">
                  <HAASForm />
                  <select onChange={(event) => setTheme(event)} value={currTheme}>
                    <option value="ck6lq5xn7007t0783e0p51lva">Classic</option>
                    <option value="ck6lzn9bd04370783aywip306">Alternative</option>
                  </select>
                </ColumnFlex>
              </FormContext>
            </JSONTreeProvider>
          </CenteredScreen>
        </MainAppScreen>
      </ThemeProvider>
    </>
  );
}

export default App;
