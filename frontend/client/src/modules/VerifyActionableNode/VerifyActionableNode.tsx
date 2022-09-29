import * as Sentry from '@sentry/react';
import * as UI from '@haas/ui';
import { AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';

import { FullScreenLayout } from 'layouts/FullScreenLayout';
import { LanguageEnumType, useVerifyActionableMutation } from 'types/generated-types';
import { MainHeader, SubHeader, Text } from 'components/Type/Headers';
import { useDialogueState } from 'modules/Dialogue/DialogueState';
import DialogueTreeLayout from 'layouts/DialogueTreeLayout';
import Loader from 'components/Loader';
import NodeLayout from 'layouts/NodeLayout';

import { VerifyActionableNodeContainer } from './VerifyActionableNodeStyles';

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

const getHeaderText = (language?: LanguageEnumType) => {
  switch (language) {
    case LanguageEnumType.Dutch:
      return 'Bedankt voor uw bevestiging';
    case LanguageEnumType.English:
      return 'Thank you for your confirmation';
    case LanguageEnumType.German:
      return 'Danke für deine Bestätigung';
    default:
      return 'Thank you for your confirmation';
  }
};

const getSubHeaderText = (language?: LanguageEnumType) => {
  switch (language) {
    case LanguageEnumType.Dutch:
      return 'We komen zo snel mogelijk bij u terug';
    case LanguageEnumType.English:
      return 'We get back to you soon';
    case LanguageEnumType.German:
      return 'Wir melden uns schnellstmöglich bei Ihnen zurück';
    default:
      return 'We get back to you soon';
  }
};

const VerifyActionableNode = () => {
  const { dialogue } = useDialogueState();
  const { actionableId } = useParams();

  const header = getHeaderText(dialogue?.language || undefined);
  const subHeader = getSubHeaderText(dialogue?.language || undefined);

  const [verifyActionable] = useVerifyActionableMutation({
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
    <DialogueTreeLayout isAtLeaf>
      <AnimatePresence exitBeforeEnter>
        {dialogue ? (
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
        ) : (
          <FullScreenLayout>
            <Loader />
          </FullScreenLayout>
        )}

      </AnimatePresence>
    </DialogueTreeLayout>

  );
};
export default VerifyActionableNode;
