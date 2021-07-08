import { ChevronLeft } from 'react-feather';
import { Container } from '@haas/ui';
import { Helmet } from 'react-helmet';
import { Variants } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import React, { ReactNode } from 'react';

import { TreeNodeProps } from 'models/Tree/TreeNodeModel';
import WatermarkLogo from 'components/WatermarkLogo';
import useDialogueTree from 'providers/DialogueTreeProvider';

import { DialogueTreeContainer, GoBackButton, GoBackContainer, GoBackText } from './DialogueTreeStyles';

const routerNavigationAnimation: Variants = {
  initial: {
    x: -100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -100,
    opacity: 0,
  },
};

interface DialogueTreeLayoutProps {
  children: ReactNode;
  node: TreeNodeProps;
  isAtLeaf: boolean;
}

const DialogueTreeLayout = ({ children, node, isAtLeaf }: DialogueTreeLayoutProps) => {
  const history = useHistory();
  const { store } = useDialogueTree();

  return (
    <DialogueTreeContainer>
      {/* TODO: Enable consistent animation */}
      {!node.isRoot && !node.isPostLeaf && !isAtLeaf && (
        <GoBackContainer variants={routerNavigationAnimation} animate="animate" initial="initial" exit="exit">
          <GoBackButton onClick={() => history.goBack()}>
            <ChevronLeft />
          </GoBackButton>
          <GoBackText>Go back</GoBackText>
        </GoBackContainer>
      )}

      <Container mt={4}>
        {children}
      </Container>

      {!!store.customer && (
        <Helmet>
          <title>
            haas -
            {' '}
            {store?.tree?.title || ''}
          </title>
          <meta name="description" content={store.tree?.title} />
        </Helmet>
      )}

      {!!store.customer && (
        <WatermarkLogo
          logoUrl={store.customer?.settings?.logoUrl}
          opacity={store.customer?.settings?.logoOpacity ?? undefined}
        />
      )}
    </DialogueTreeContainer>
  );
};

export default DialogueTreeLayout;
