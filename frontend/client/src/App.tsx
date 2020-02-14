import React from 'react';
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

  const leafNodes = useQuery<any>(GET_LEAF_NODES)

  const { 
    data, 
    loading, 
    error
  } = useQuery<any>(GET_QUESTIONNAIRE);

  const cleanData = data?.questionnaire?.questions;
  const finalData = {questionnaire: cleanData, LeafCollection: leafNodes?.data?.leafNodes};
  
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
