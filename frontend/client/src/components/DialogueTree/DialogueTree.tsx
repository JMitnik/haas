import React from 'react';
import { Loader, Container } from '@haas/ui';

import useDialogueTree from 'providers/dialogue-tree-provider';
import { DialogueContainer } from './DialogueTreeStyles';
import NodePage from 'pages/[customer]/[dialogue]/[node]';
import WatermarkLogo from 'components/WatermarkLogo';

const DialogueTree = () => {
  const { treeState: { dialogue, customer } } = useDialogueTree();

  if (!dialogue) return <Loader />;

  return (
    <DialogueContainer>
      <Container>
        <NodePage />
      </Container>

      <WatermarkLogo logoUrl={customer.settings.logoUrl} />
    </DialogueContainer>
  );
};

export default DialogueTree;
