import { Container } from '@haas/ui';
import React, { ReactNode, useEffect } from 'react';

import Loader from 'components/Loader';
import WatermarkLogo from 'components/WatermarkLogo';
import useProject from 'providers/ProjectProvider';

import { ChevronLeft } from 'react-feather';
import { useHistory } from 'react-router-dom';
import { DialogueContainer, GoBackButton } from './DialogueTreeStyles';

const DialogueTreeLayout = ({ children }: { children: ReactNode }) => {
  const { customer } = useProject();
  const history = useHistory();

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
      <GoBackButton onClick={() => history.goBack()}>
        <ChevronLeft />
      </GoBackButton>
      <Container>
        {children}
      </Container>

      {!!customer && <WatermarkLogo logoUrl={customer.settings.logoUrl} />}
    </DialogueContainer>
  );
};

export default DialogueTreeLayout;
