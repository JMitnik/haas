import React, { useEffect, useState } from 'react';
import useQuestionnaire from 'providers/dialogue-provider';
import { Loader, Container } from '@haas/ui';
import { HAASTreeProvider } from 'providers/dialogue-tree-provider';

import { ThemeProvider } from 'styled-components';
import { makeCustomTheme } from 'utils/makeCustomerTheme';
import { DialogueContainer } from './DialogueTreeStyles';
import NodePage from 'pages/dialogue/[node]';

const DialogueTree = () => {
  const { questionnaire, customer } = useQuestionnaire();
  const [customTheme, setCustomTheme] = useState({});

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
        <DialogueContainer>
          <Container>
            <HAASTreeProvider questionnaire={questionnaire}>
              <NodePage />
            </HAASTreeProvider>
          </Container>
        </DialogueContainer>
      </ThemeProvider>
    </>
  );
};

export default DialogueTree;
