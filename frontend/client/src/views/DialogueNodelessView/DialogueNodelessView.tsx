import React, { useEffect } from 'react';

import { Dialogue } from 'types/core-types';
import { FullScreenLayout } from 'layouts/FullScreenLayout';
import { useDialogueState } from 'modules/Dialogue/DialogueState';
import { useNavigator } from 'modules/Navigation/useNavigator';
import Loader from 'components/Loader';

/**
 * View a users views initially prior to arriving at any node. This is a "loading state" view, and typically
 * should redirect a user to the `DialogueView` with a particular node.
 */
export const DialogueNodelessView = () => {
  const { transition } = useNavigator();
  const dialogue = useDialogueState((state) => state.dialogue) as Dialogue;

  /**
   * Effect responsible for redirecting to root node.
   */
  useEffect(() => {
    if (dialogue?.rootQuestion) { transition(dialogue.rootQuestion.id); }
  }, [transition, dialogue]);

  // Render a loader while we are waiting
  return (
    <FullScreenLayout>
      <Loader />
    </FullScreenLayout>
  );
};
