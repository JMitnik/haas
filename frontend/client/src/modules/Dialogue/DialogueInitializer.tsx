import { useMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { useDialogueState } from 'modules/Dialogue/DialogueState';
import { useGetCustomerQuery } from 'types/generated-types';

export const DialogueInitializer = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const { initialize } = useDialogueState();

  const initLanguage = (language: string | undefined) => {
    switch (language) {
      case 'ENGLISH':
        i18n.changeLanguage('en');
        break;
      case 'GERMAN':
        i18n.changeLanguage('de');
        break;
      case 'DUTCH':
        i18n.changeLanguage('nl');
        break;
      default:
        i18n.changeLanguage('en');
        break;
    }
  };

  const workspaceMatch = useMatch({
    path: '/:workspaceSlug/:dialogueSlug/*',
  });

  /**
   * Fetch the workspace and dialogue, and initialize the store based on these results.
   */
  useGetCustomerQuery({
    skip: !workspaceMatch,
    fetchPolicy: 'network-only',
    onError: (e) => {
      console.log(e.message);
    },
    variables: {
      slug: workspaceMatch?.params.workspaceSlug as string,
      dialogueSlug: workspaceMatch?.params.dialogueSlug as string,
    },
    onCompleted: (data) => {
      const dialogue = data?.customer?.dialogue;
      const workspace = data?.customer;

      if (!dialogue || !workspace) return;

      initialize(dialogue, workspace, {
        device: navigator.platform || 'unknown',
        originUrl: window.location.origin,
      });
      initLanguage(dialogue.language);
    },
  });

  return (
    <>
      {children}
    </>
  );
};
