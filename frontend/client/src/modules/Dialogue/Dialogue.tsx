import { useHistory, useLocation } from 'react-router-dom';
import React, { useCallback, useEffect } from 'react';

import { MapNode } from 'modules/Node/MapNode';
import { QuestionNode, SessionEvent } from 'types/core-types';
import { useNavigator } from 'modules/Navigation/useNavigator';
import { useTrackFinished } from 'modules/PostLeafNode/useTrackFinished';

import { useDialogueState } from './DialogueState';

export const Dialogue = () => {
  const { transition, nodeId } = useNavigator();
  const location = useLocation();
  const history = useHistory();
  const { action } = history;

  // Get the current node from the store
  const getCurrentNode = useDialogueState((state) => state.getCurrentNode);
  const currentNode = getCurrentNode() as QuestionNode | undefined;

  const isFinished = useDialogueState((state) => state.isFinished);

  // Track if we are finished, and show finished modal if so
  useTrackFinished();

  const detectUndoRedo = useDialogueState((state) => state.detectUndoRedo);
  const applyEvent = useDialogueState((state) => state.applyEvent);

  // If the user navigates front or backwards, detect them as undo/redo, and sync with the state
  useEffect(() => {
    if (action !== 'POP' || !nodeId) return;
    if (isFinished) return;

    detectUndoRedo(nodeId);
  }, [location, action, nodeId, isFinished, detectUndoRedo]);

  // The main callback for handling an event (State + Action + Reward) and transition to the next event.
  const handleAction = useCallback((input: SessionEvent) => {
    const newEvent = applyEvent(input);
    transition(newEvent?.state?.nodeId);
  }, [applyEvent, transition]);

  if (!currentNode) return null;

  const SelectedQuestionNode = MapNode[currentNode.type];

  return (
    // @ts-ignore
    <SelectedQuestionNode node={currentNode} onRunAction={handleAction} />
  );
};
