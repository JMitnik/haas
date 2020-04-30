import React, { useEffect, useState } from 'react';
import useDialogueTree from 'providers/dialogue-tree-provider';
import { Loader, Container } from '@haas/ui';

import { DialogueContainer } from './DialogueTreeStyles';
import NodePage from 'pages/[customer]/[dialogue]/[node]';

const DialogueTree = () => {
  const { treeState: { dialogue } } = useDialogueTree();

  if (!dialogue) return <Loader />;

  return (
    <>
        <DialogueContainer>
          <Container>
              <NodePage />
          </Container>
        </DialogueContainer>
    </>
  );
};

export default DialogueTree;
