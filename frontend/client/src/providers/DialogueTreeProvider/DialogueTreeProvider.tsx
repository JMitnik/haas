import { useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { useDialogueState } from 'modules/Dialogue/DialogueState';
import { useGetCustomerQuery } from 'types/generated-types';

export const DialogueTreeProvider = ({ children }: { children: React.ReactNode }) => {
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

  const customerMatch = useRouteMatch<any>({
    path: '/:workspaceSlug/:dialogueSlug',
    strict: true,
  });

  /**
   * Fetch the workspace and dialogue, and initialize the store based on these results.
   */
  useGetCustomerQuery({
    skip: !customerMatch,
    fetchPolicy: 'network-only',
    onError: (e) => {
      console.log(e.message);
    },
    variables: {
      slug: customerMatch?.params.workspaceSlug,
      dialogueSlug: customerMatch?.params.dialogueSlug,
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
