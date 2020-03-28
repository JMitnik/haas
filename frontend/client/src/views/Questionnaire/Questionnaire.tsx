import React, { useRef, useEffect, useState } from 'react';
import useQuestionnaire from 'hooks/use-questionnaire';
import { Loader } from '@haas/ui';
import { HAASTreeProvider } from 'hooks/use-haas-tree';
import QuestionnaireTree from './QuestionnaireTree/QuestionnaireTree';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { makeCustomTheme } from 'utils/makeCustomerTheme';

const Questionnaire = () => {
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
      <HAASTreeProvider questionnaire={questionnaire}>
        <ThemeProvider theme={(theme: any) => makeCustomTheme(theme, customTheme)}>
          <QuestionnaireTree />
        </ThemeProvider>
      </HAASTreeProvider>
    </>
  );
};

export default Questionnaire;
