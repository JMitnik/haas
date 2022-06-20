import React, { useEffect } from 'react';

import { Dialogue } from 'types/core-types';
import { useDialogueState } from 'modules/Dialogue/DialogueState';
import { useNavigator } from 'modules/Navigation/useNavigator';

export const DialogueRedirectView = () => {
  const { transition } = useNavigator();
  const dialogue = useDialogueState((state) => state.dialogue) as Dialogue;

  /**
   * Effect responsible for redirecting to root node if we detect no node-id.
   */
  useEffect(() => {
    if (dialogue?.rootQuestion) { transition(dialogue.rootQuestion.id); }
  }, [transition, dialogue]);

  return (
    <div />
  );
};
