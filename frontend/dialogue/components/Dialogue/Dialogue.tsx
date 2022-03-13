import React, { useCallback, useEffect } from 'react'
import { useNavigationType, useParams, useLocation } from 'react-router';

import {
  QuestionNodeTypeEnum,
  QuestionNode as QuestionNodeType,
  Dialogue as DialogueType,
  SessionEvent,
} from '../../types/core-types';
import { useDialogueStore } from './DialogueStore';
import { SliderNode } from '../SliderNode/SliderNode';
import { ChoiceNode } from '../ChoiceNode/ChoiceNode';
import { LinkNode } from '../LinkNode/LinkNode';
import FormNode from '../FormNode/FormNode';
import { useNavigator } from '../Navigation/useNavigator';
import { ShareNode } from '../ShareNode/ShareNode';
import { PostLeafNode } from '../PostLeafNode/PostLeafNode';
import { QuestionNodeProps as GenericQuestionNodeProps } from '../QuestionNode/QuestionNodeTypes';
import { useDebouncedEffect } from '../../hooks/useDebouncedEffect';
import { SessionEventInput } from '../../types/generated-types';
import { useSession } from '../Session/SessionProvider';
import { VideoNode } from '../VideoNode/VideoNode';

interface DialogueProps {
  dialogue: DialogueType;
  onEventUpload: (events: SessionEventInput[]) => void;
}

const NodeComponent: { [key in QuestionNodeTypeEnum]?: React.FC<GenericQuestionNodeProps> } = {
  [QuestionNodeTypeEnum.Slider]: SliderNode,
  [QuestionNodeTypeEnum.Choice]: ChoiceNode,
  [QuestionNodeTypeEnum.Textbox]: ChoiceNode,
  [QuestionNodeTypeEnum.Form]: FormNode,
  [QuestionNodeTypeEnum.Link]: LinkNode,
  [QuestionNodeTypeEnum.Registration]: ChoiceNode,
  [QuestionNodeTypeEnum.Share]: ShareNode,
  [QuestionNodeTypeEnum.VideoEmbedded]: VideoNode,
  [QuestionNodeTypeEnum.Generic]: PostLeafNode,
};

export const Dialogue = ({ onEventUpload }: DialogueProps) => {
  const { sessionId } = useSession();
  const { nodeId, workspace: workspaceSlug, dialogue: dialogueSlug } = useParams();
  const { transition } = useNavigator({ dialogueSlug, workspaceSlug });
  const location = useLocation();
  const navigationType = useNavigationType();

  // Get all main operations from the store
  const getCurrentNode = useDialogueStore(state => state.getCurrentNode);
  const detectUndoRedo = useDialogueStore(state => state.detectUndoRedo);
  const applyEvent = useDialogueStore(state => state.applyEvent);
  const { uploadEvents, popEventQueue } = useDialogueStore(state => ({
    uploadEvents: state.uploadEvents,
    popEventQueue: state.popEventQueue,
  }));

  // Get the current node from the store
  const currentNode = getCurrentNode() as QuestionNodeType | undefined;

  // If the user navigates front or backwards, detect them as undo/redo, and sync with the state
  useEffect(() => {
    if (navigationType !== 'POP' || !nodeId) return;

    detectUndoRedo(nodeId);
  }, [location, navigationType, nodeId, detectUndoRedo])

  // Upload the events to the API
  useDebouncedEffect(() => {
    if (uploadEvents.length > 0) {
      const events = popEventQueue();

      const inputs: SessionEventInput[] = events.map(event => ({
        sessionId,
        timestamp: Date.now(),
        state: { nodeId: event.state.nodeId },
        action: event.action,
      }));

      onEventUpload?.(inputs);
    }
  }, [uploadEvents.length, popEventQueue, sessionId], 2000);

  // The main callback for handling an event (State + Action + Reward)
  const handleAction = useCallback((input: SessionEvent) => {
    const newEvent = applyEvent(input);
    transition(newEvent);
  }, [applyEvent, transition]);

  if (!currentNode) return null;

  const QuestionNode = NodeComponent[currentNode.type];

  return (
    <QuestionNode node={currentNode} onRunAction={handleAction}/>
  )
};
