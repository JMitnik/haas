import React, { useRef, useEffect, useState } from 'react';
import useQuestionnaire from 'hooks/use-questionnaire';
import { Loader } from '@haas/ui';
import { HAASTreeProvider } from 'hooks/use-haas-tree';

import { useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { makeCustomTheme } from 'utils/makeCustomerTheme';
import { NodeContainer, QuestionnaireContainer } from './QuestionnaireStyles';
import Node from './nodes/Node';

const QuestionnaireTree = () => {
  const { questionnaire, customer } = useQuestionnaire();
  const [customTheme, setCustomTheme] = useState({});
  const location = useLocation();

  const locationRef = useRef(location.pathname);

  // Customize app for customer
  useEffect(() => {
    if (customer?.name) {
      window.document.title = `${customer.name} | Powered by HAAS`;
    }

    if (customer?.settings) {
      const customerTheme = { colors: customer?.settings?.colourSettings };
      setCustomTheme(customerTheme);
    }
  }, [customer]);

  if (!questionnaire) return <Loader />;

  return (
    <>
      <ThemeProvider theme={(theme: any) => makeCustomTheme(theme, customTheme)}>
        <QuestionnaireContainer>
          <HAASTreeProvider questionnaire={questionnaire}>
            <NodeContainer useFlex flex="100%" alignItems="stretch">
              <Node />
            </NodeContainer>
          </HAASTreeProvider>
        </QuestionnaireContainer>
      </ThemeProvider>
    </>
  );
};

export default QuestionnaireTree;
