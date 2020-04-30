import React, { useEffect, useState } from 'react';
import useDialogueTree from 'providers/dialogue-tree-provider';
import { Loader, Container, Div, WatermarkLogo } from '@haas/ui';

import { DialogueContainer } from './DialogueTreeStyles';
import NodePage from 'pages/[customer]/[dialogue]/[node]';

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
