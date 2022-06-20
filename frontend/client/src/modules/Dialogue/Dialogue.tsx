import { useHistory, useLocation } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo } from 'react';

import { MapNode } from 'modules/Node/MapNode';
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

  // Get the current dialogue and node fetcher
  const { dialogue, getCurrentNode } = useDialogueState((state) => ({
    dialogue: state.dialogue,
    getCurrentNode: state.getCurrentNode,
  }));
  const currentNode = getCurrentNode() as QuestionNode;

  // Track if we are finished, and show finished modal if so
  useTrackFinished();

  // Get the action handlers to apply an event, and detect BACK / FORWARD
  const { applyEvent, detectUndoRedo } = useDialogueState((state) => ({
    detectUndoRedo: state.detectUndoRedo,
    applyEvent: state.applyEvent,
  }));

  /**
   * Effect responsible for redirecting to root node if we detect no node-id.
   */
  useEffect(() => {
    if (!nodeId && dialogue?.rootQuestion) { transition(dialogue.rootQuestion.id); }
  }, [nodeId, transition, dialogue]);

  /**
   * Effect responsible for keeping our UNDO/REDO browser navigation in sync with our event store.
   */
  useEffect(() => {
    if (action !== 'POP') return;

    detectUndoRedo(nodeId);
  }, [location, nodeId, detectUndoRedo]);

  /**
   * The main callback for handling an event (State + Action + Reward), and transitioning to the next event.
   *
   * The general setup is:
   * 1. Calculate our next partial event (State) based on the incoming event (State + Action + Reward).
   * 2. Transition in our router to the next node-id.
   * 3. Upload the events to our server (batched or not).
   */
  const handleAction = useCallback((input: SessionEvent) => {
    const newEvent = applyEvent(input);
    transition(newEvent?.state?.nodeId);
  }, [applyEvent, transition]);

  /**
   * Memoize the current active question-node component.
   */
  const SelectedQuestionNode = useMemo(() => {
    if (!currentNode?.type) return null;

    return MapNode[currentNode.type];
  }, [currentNode?.type]);
  if (!SelectedQuestionNode) return null;

  return (
    <DialogueTreeLayout isAtLeaf={currentNode.isLeaf} node={currentNode}>
      <NodeLayout>
        <SelectedQuestionNode key={currentNode.id} node={currentNode} onRunAction={handleAction} />
      </NodeLayout>
    </DialogueTreeLayout>
  );
};
