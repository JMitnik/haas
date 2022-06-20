import { useHistory, useLocation } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo } from 'react';

import { MapNode } from 'modules/Node/MapNode';
import { POSTLEAFNODE_ID } from 'modules/PostLeafNode/PostLeafNode';
import { QuestionNode, SessionEvent } from 'types/core-types';
import { useNavigator } from 'modules/Navigation/useNavigator';
import { useTrackFinished } from 'modules/PostLeafNode/useTrackFinished';
import DialogueTreeLayout from 'layouts/DialogueTreeLayout';
import NodeLayout from 'layouts/NodeLayout';
// import useUploadQueue from 'modules/Upload/UploadQueueProvider';

import { useDialogueState } from './DialogueState';

export const Dialogue = () => {
  const { transition, nodeId } = useNavigator();
  const history = useHistory();
  const location = useLocation();
  const { action } = history;

  // Get the current node from the store
  const getCurrentNode = useDialogueState((state) => state.getCurrentNode);
  const currentNode = getCurrentNode() as QuestionNode | undefined;

  const isFinished = useDialogueState((state) => state.isFinished);

  // Track if we are finished, and show finished modal if so
  useTrackFinished();

  const detectUndoRedo = useDialogueState((state) => state.detectUndoRedo);
  const applyEvent = useDialogueState((state) => state.applyEvent);
  const dialogue = useDialogueState((state) => state.dialogue);

  useEffect(() => {
    if (!nodeId && dialogue?.rootQuestion) { transition(dialogue.rootQuestion.id); }
  }, [nodeId, transition, dialogue]);

  // If the user navigates front or backwards, detect them as undo/redo, and sync with the state
  useEffect(() => {
    if (action !== 'POP') return;
    if (isFinished) return;

    detectUndoRedo(nodeId);
  }, [location, nodeId, isFinished, detectUndoRedo]);

  // The main callback for handling an event (State + Action + Reward) and transition to the next event.
  const handleAction = useCallback((input: SessionEvent) => {
    console.log(input);
    const newEvent = applyEvent(input);
    transition(newEvent?.state?.nodeId);

    // const goesToCallToAction = newEvent?.state?.nodeId === newEvent?.state?.activeCallToActionId;
    // const goesToPostLeaf = newEvent?.state?.nodeId === POSTLEAFNODE_ID;

    // TODO: Upload events.
    // if (goesToCallToAction || goesToPostLeaf) {
    // }
  }, [applyEvent, transition]);

  const SelectedQuestionNode = useMemo(() => {
    console.log(`SelectedQuestionNode is being remounted due to ${currentNode?.type}`);
    if (!currentNode?.type) return null;

    return MapNode[currentNode.type];
  }, [currentNode?.type]);

  if (!SelectedQuestionNode) return null;
  console.log({ currentNode });

  return (
    <DialogueTreeLayout isAtLeaf={currentNode.isLeaf} node={currentNode}>
      <NodeLayout>
        {/* @ts-ignore */}
        <SelectedQuestionNode key={currentNode.id} node={currentNode} onRunAction={handleAction} />
      </NodeLayout>
    </DialogueTreeLayout>
  );
};
