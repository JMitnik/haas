import React, { ReactNode } from 'react';
import { Container } from '@haas/ui';

import useDialogueTree from 'providers/DialogueTreeProvider';
import { DialogueContainer } from './DialogueTreeStyles';
import NodePage from 'pages/[customer]/[dialogue]/[node]';
import WatermarkLogo from 'components/WatermarkLogo';
import Loader from 'components/Loader';

const DialogueTreeLayout = ({ children }: { children: ReactNode }) => {
  const { treeState: { dialogue, customer } } = useDialogueTree();

  if (!dialogue) return <Loader />;

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
