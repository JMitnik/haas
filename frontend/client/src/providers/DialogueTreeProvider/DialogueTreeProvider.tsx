import { useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';

import { useDialogueState } from 'modules/Dialogue/DialogueState';
import { useGetCustomerQuery, useGetDialogueQuery } from 'types/generated-types';

export const DialogueTreeProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const { initialize } = useDialogueState();

  // const device = useMemo(() => navigator.platform, []);
  // const originUrl = useMemo(() => window.location.origin, [window.location.origin]);
  // const startTime = useMemo(() => Date.now(), []);

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
    path: '/:workspaceSlug',
    strict: true,
  });

  const { data: workspaceData } = useGetCustomerQuery({
    skip: !customerMatch,
    fetchPolicy: 'network-only',
    onError: (e) => {
      console.log(e.message);
    },
    variables: {
      slug: customerMatch?.params.workspaceSlug,
    },
  });
  const dialogueMatch = useRouteMatch<any>('/:workspaceSlug/:dialogueSlug');

  const { data: dialogueData } = useGetDialogueQuery({
    skip: !dialogueMatch,
    fetchPolicy: 'network-only',
    onError: (e) => {
      console.log(e.message);
    },
    variables: {
      dialogueSlug: dialogueMatch?.params.dialogueSlug,
      customerSlug: dialogueMatch?.params.workspaceSlug,
    },
  });

  // When dialogue changes, set initial nodes and initial edges
  useEffect(() => {
    if (workspaceData?.customer && dialogueData?.customer?.dialogue) {
      const { dialogue } = dialogueData.customer;
      const workspace = workspaceData.customer;

      initialize(dialogue, workspace, {
        device: navigator.platform || 'unknown',
        originUrl: window.location.origin,
      });
      initLanguage(dialogue.language);
    }
  }, [workspaceData && dialogueData]);

  return (
    <>
      {children}
    </>
  );
};
