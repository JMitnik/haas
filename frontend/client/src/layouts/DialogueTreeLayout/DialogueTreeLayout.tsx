import { ChevronLeft } from 'react-feather';
import { Container } from '@haas/ui';
import { Helmet } from 'react-helmet';
import { Variants } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { ReactNode } from 'react';

import { QuestionNode } from 'types/core-types';
import { useDialogueState } from 'modules/Dialogue/DialogueState';
import WatermarkLogo from 'components/WatermarkLogo';

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
  node: QuestionNode;
  isAtLeaf: boolean;
}

const DialogueTreeLayout = ({ children, node, isAtLeaf }: DialogueTreeLayoutProps) => {
  const history = useHistory();
  const { t } = useTranslation();

  const { workspace, isFinished } = useDialogueState((state) => ({
    workspace: state.workspace,
    isFinished: state.isFinished,
  }));

  return (
    <DialogueTreeContainer>
      {/* TODO: Enable consistent animation */}
      {!node.isRoot && !isFinished && !isAtLeaf && (
        <GoBackContainer variants={routerNavigationAnimation} animate="animate" initial="initial" exit="exit">
          <GoBackButton onClick={() => history.goBack()}>
            <ChevronLeft />
          </GoBackButton>
          <GoBackText>{t('go_back') || 'Go back'}</GoBackText>
        </GoBackContainer>
      )}

      <Container mt={4}>
        {children}
      </Container>

      {!!workspace && (
        <Helmet>
          <title>
            haas -
            {' '}
            {workspace.name || ''}
          </title>
          <meta name="description" content={workspace.name} />
        </Helmet>
      )}

      {!!workspace && (
        <WatermarkLogo
          logoUrl={workspace?.settings?.logoUrl || ''}
          opacity={workspace?.settings?.logoOpacity ?? undefined}
        />
      )}
    </DialogueTreeContainer>
  );
};

export default DialogueTreeLayout;
