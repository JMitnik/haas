import { ChevronLeft } from 'react-feather';
import { Container } from '@haas/ui';
import { useHistory } from 'react-router-dom';
import React, { ReactNode } from 'react';

import WatermarkLogo from 'components/WatermarkLogo';
import useDialogueTree from 'providers/DialogueTreeProvider';

import { DialogueContainer, GoBackButton } from './DialogueTreeStyles';

const DialogueTreeLayout = ({ children }: { children: ReactNode }) => {
  const history = useHistory();
  const store = useDialogueTree();

  return (
    <DialogueContainer>
      <GoBackButton onClick={() => history.goBack()}>
        <ChevronLeft />
      </GoBackButton>
      <Container>
        {children}
      </Container>

      {!!store.customer && <WatermarkLogo logoUrl={store.customer?.settings?.logoUrl} />}
    </DialogueContainer>
  );
};

export default DialogueTreeLayout;
