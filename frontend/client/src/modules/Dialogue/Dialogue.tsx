import { useHistory, useLocation } from 'react-router-dom';
import React, { useCallback, useEffect } from 'react';

import { MapNode } from 'modules/Node/MapNode';
import { QuestionNode, SessionEvent } from 'types/core-types';
import { useNavigator } from 'modules/Navigation/useNavigator';
import { useTrackFinished } from 'modules/PostLeafNode/useTrackFinished';
import DialogueTreeLayout from 'layouts/DialogueTreeLayout';
import NodeLayout from 'layouts/NodeLayout';

import { useDialogueState } from './DialogueState';
import { POSTLEAFNODE_ID } from 'modules/PostLeafNode/PostLeafNode';
import useUploadQueue from 'modules/Upload/UploadQueueProvider';

export const Dialogue = () => {
  const { transition, nodeId } = useNavigator();
  const location = useLocation();
  const history = useHistory();
  const { action } = history;
  const { u } = useUploadQueue();

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

    const goesToCallToAction = newEvent?.state?.nodeId === newEvent?.state?.activeCallToActionId;
    const goesToPostLeaf = newEvent?.state?.nodeId === POSTLEAFNODE_ID;

    if (goesToCallToAction || goesToPostLeaf) {
    }
    transition(newEvent?.state?.nodeId);

    if (newEvent?.state.)
  }, [applyEvent, transition]);

  if (!currentNode) return null;

  const SelectedQuestionNode = MapNode[currentNode.type];

  return (
    <DialogueTreeLayout isAtLeaf={currentNode.isLeaf} node={currentNode}>
      <NodeLayout>
        {/* @ts-ignore */}
        <SelectedQuestionNode node={currentNode} onRunAction={handleAction} />
      </NodeLayout>
    </DialogueTreeLayout>
  );
};
