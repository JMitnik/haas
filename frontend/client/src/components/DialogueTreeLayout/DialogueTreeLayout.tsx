import React, { ReactNode, useEffect } from 'react';
import { Container } from '@haas/ui';

import { DialogueContainer } from './DialogueTreeStyles';
import WatermarkLogo from 'components/WatermarkLogo';
import Loader from 'components/Loader';
import useProject from 'providers/ProjectProvider';

const DialogueTreeLayout = ({ children }: { children: ReactNode }) => {
  const { customer } = useProject();

  // Customize app for customer
  useEffect(() => {
    if (customer?.name) {
      window.document.title = `${customer?.name} | Powered by HAAS`;
    }

    if (customer?.settings) {
      // setCustomTheme(customerTheme);
    }
  }, [customer]);

  if (!customer) return <Loader />;

  return (
    <DialogueContainer>
      <Container>
        {children}
      </Container>

      {!!customer && <WatermarkLogo logoUrl={customer.settings.logoUrl} />}
    </DialogueContainer>
  );
};

export default DialogueTreeLayout;
