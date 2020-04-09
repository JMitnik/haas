import React, { useRef, useEffect, useState } from 'react';
import useQuestionnaire from 'hooks/use-questionnaire';
import { Loader, Container } from '@haas/ui';
import { HAASTreeProvider } from 'hooks/use-haas-tree';

import { useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { makeCustomTheme } from 'utils/makeCustomerTheme';
import { QuestionnaireContainer } from './QuestionnaireTreeStyles';
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
          <Container>
            <HAASTreeProvider questionnaire={questionnaire}>
              <Node />
            </HAASTreeProvider>
          </Container>
        </QuestionnaireContainer>
      </ThemeProvider>
    </>
  );
};

export default QuestionnaireTree;
