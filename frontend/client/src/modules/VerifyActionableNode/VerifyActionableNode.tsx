import * as Sentry from '@sentry/react';
import * as UI from '@haas/ui';
import React, { useEffect } from 'react';

import { MainHeader, SubHeader, Text } from 'components/Type/Headers';
import { QuestionNode, QuestionNodeTypeEnum } from 'types/core-types';
import { useDialogueState } from 'modules/Dialogue/DialogueState';

import { AnimatePresence } from 'framer-motion';
import { LanguageEnumType, useVerifyActionableMutation } from 'types/generated-types';
import { useParams } from 'react-router-dom';
import DialogueTreeLayout from 'layouts/DialogueTreeLayout';
import NodeLayout from 'layouts/NodeLayout';

import { VerifyActionableNodeContainer } from './VerifyActionableNodeStyles';

export const POSTLEAFNODE_ID = '-1';

export const defaultPostLeafNode: QuestionNode = {
  id: POSTLEAFNODE_ID,
  title: '',
  type: QuestionNodeTypeEnum.Generic,
  isLeaf: true,
  isRoot: false,
  links: [],
  options: [],
  children: [],
};

const getCloseText = (language?: LanguageEnumType) => {
  switch (language) {
    case LanguageEnumType.Dutch:
      return 'U kunt nu dit scherm sluiten';
    case LanguageEnumType.English:
      return 'You may close this window now';
    case LanguageEnumType.German:
      return 'Sie können dieses Fenster jetzt schließen';
    default:
      return 'You may close this window now';
  }
};

const VerifyActionableNode = () => {
  const { dialogue } = useDialogueState();
  const { actionableId } = useParams();
  console.log('Params:', actionableId);

  const header = dialogue?.postLeafNode?.header || 'Thank you for participating!';
  const subHeader = dialogue?.postLeafNode?.subtext || 'Life should be fulfilling';

  const [verifyActionable] = useVerifyActionableMutation({
    onCompleted: () => {
    },
    onError: (error) => {
      Sentry.captureException(error);
    },
  });

  useEffect(() => {
    if (actionableId) {
      verifyActionable({
        variables: {
          input: {
            actionableId,
            workspaceId: dialogue?.customerId as string,
          },
        },
      });
    }
  }, [actionableId]);

  return (
    <DialogueTreeLayout isAtLeaf node={null as any}>
      <AnimatePresence exitBeforeEnter>
        <NodeLayout>
          <VerifyActionableNodeContainer>
            <MainHeader>{header}</MainHeader>
            <UI.Div>
              <SubHeader textAlign="center">
                {subHeader}
              </SubHeader>
              <Text>{getCloseText(dialogue?.language || undefined)}</Text>
            </UI.Div>
          </VerifyActionableNodeContainer>
        </NodeLayout>
      </AnimatePresence>
    </DialogueTreeLayout>

  );
};
export default VerifyActionableNode;
