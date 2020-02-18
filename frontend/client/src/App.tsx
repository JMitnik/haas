import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled, { css, ThemeProvider } from 'styled-components';
import theme from './theme';
import { FormContext, useForm } from 'react-hook-form';
import { Div } from '@haas/ui';
import { ColumnFlex } from '@haas/ui/src/Container';
import flow from './flow.json';
import { JSONTreeProvider } from './hooks/use-json-tree';
import { HAASForm } from './HAASForm';
import { StudySelector } from './StudySelector'
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

  const [currStudy, setCurrStudy] = useState('')

  const leafNodes = useQuery<any>(GET_LEAF_NODES)

  const {
    data,
    loading,
    error
  } = useQuery<any>(GET_QUESTIONNAIRE, { variables: {id: currStudy}});

  console.log('QUESTIONNAIRE DATA: ', data)

  const getCurrentStudyFromChild = (studyId: string) => {
    setCurrStudy(studyId)
  }

  if (data?.questionnaire?.customer?.settings?.colourSettings) {
    const {title, lightest, light, normal, dark, darkest, muted, text, primary, secondary, tertiary, success, warning, error } = data?.questionnaire?.customer?.settings?.colourSettings
    const colours = {'title': title, 'black': 'black', 'white': 'white', 'primary': primary, 'secondary': secondary, 'tertiary': tertiary, 'success': success, 'warning': warning, 'error': error, default: { 'lightest': lightest, 'light': light, 'normal': normal, 'dark': dark, 'darkest': darkest, 'muted': muted, 'text': text } }
    theme.colors = colours
  }

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
                  {currStudy && <HAASForm />}
                  {!currStudy && <StudySelector sendCurrentStudyToParent={getCurrentStudyFromChild}></StudySelector>}
                  {/* <select onChange={(event) => setTheme(event)} value={currTheme}>
                    <option value="ck6lq5xn7007t0783e0p51lva">Classic</option>
                    <option value="ck6lzn9bd04370783aywip306">Alternative</option>
                  </select> */}
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
