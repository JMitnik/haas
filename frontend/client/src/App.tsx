import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled, { css, ThemeProvider } from 'styled-components';

import theme from './theme';
import { FormContext, useForm } from 'react-hook-form';
import { Div, Loader } from '@haas/ui';
import { ColumnFlex } from '@haas/ui/src/Container';
import { JSONTreeProvider } from './hooks/use-json-tree';
import { HAASForm } from './HAASForm';
import { StudySelector } from './StudySelector'

import { GET_QUESTIONNAIRE } from './queries/getQuestionnaire'
import { GET_LEAF_NODES } from './queries/getLeafNodes'


const App: React.FC = () => {
  const form = useForm();

  const [currStudy, setCurrStudy] = useState('');

  const leafNodes = useQuery<any>(GET_LEAF_NODES);

  const { data, loading, error } = useQuery<any>(GET_QUESTIONNAIRE, { variables: {id: currStudy}});

  const getCurrentStudyFromChild = (studyId: string) => setCurrStudy(studyId);

  const treeData = { questionnaire: data?.questionnaire?.questions, LeafCollection: leafNodes?.data?.leafNodes };

  if (error) return <div>{'Error!' + error.message}</div>;

  return (
    <>
      <ThemeProvider theme={theme}>
        <MainAppScreen>
          <CenteredScreen>
            {loading ? <Loader/> : (
                <JSONTreeProvider json={treeData}>
                <FormContext {...form}>
                  <ColumnFlex alignItems="center">
                    {currStudy && <HAASForm />}
                    {!currStudy && <StudySelector sendCurrentStudyToParent={getCurrentStudyFromChild}></StudySelector>}
                  </ColumnFlex>
                </FormContext>
              </JSONTreeProvider>
            )}
          </CenteredScreen>
        </MainAppScreen>
      </ThemeProvider>
    </>
  );
}


const MainAppScreen = styled(Div)`
  ${() => css`
    min-width: 100vw;
    min-height: 100vh;
    /* TODO: Make something out of this */
    background: linear-gradient(270deg, #0059f8, #003da9);
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
