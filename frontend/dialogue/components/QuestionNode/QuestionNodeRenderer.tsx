import React, { useEffect } from 'react'

import { Dialogue, Workspace, QuestionNode as QuestionNodeType, SessionEventInput } from 'types/helper-types';
import { QuestionNodeTypeEnum, SessionEventType } from 'types/generated-types';
import { SliderNode } from 'components/SliderNode/SliderNode';
import { ChoiceNode } from 'components/ChoiceNode/ChoiceNode';
import { useStore } from 'components/Dialogue/DialogueRouter';

import { QuestionNodeProps as GenericQuestionNodeProps, RunActionInput } from './QuestionNodeTypes';
import { useNavigate, useNavigationType, useParams } from 'react-router';
import { useSession } from 'components/Session/SessionProvider';

interface QuestionNodeProps {
  dialogue: Dialogue;
  onEventUpload: (events: SessionEventInput[]) => void;
}

const NodeComponent: { [key in QuestionNodeTypeEnum]?: React.FC<GenericQuestionNodeProps> } = {
  [QuestionNodeTypeEnum.Slider]: SliderNode,
  [QuestionNodeTypeEnum.Choice]: ChoiceNode,
  [QuestionNodeTypeEnum.Textbox]: ChoiceNode,
  [QuestionNodeTypeEnum.Form]: ChoiceNode,
  [QuestionNodeTypeEnum.Link]: ChoiceNode,
  [QuestionNodeTypeEnum.Registration]: ChoiceNode,
  [QuestionNodeTypeEnum.VideoEmbedded]: ChoiceNode,
};

function useDebouncedEffect(fn, deps, time) {
  const dependencies = [...deps, fn, time]
  useEffect(() => {
    const timeout = setTimeout(fn, time);
    return () => {
      clearTimeout(timeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

export const QuestionNodeRenderer = ({ dialogue, onEventUpload }: QuestionNodeProps) => {
  const { nodeId } = useParams();
  const { popActionQueue, queuedActionEvents, setActiveCallToAction, logAction, getCurrentNode, actionEvents } = useStore(state => ({
    activeCallToAction: state.activeCallToAction,
    getCurrentNode: state.getCurrentNode,
    actionEvents: state.actionEvents,
    logAction: state.logAction,
    setActiveCallToAction: state.setActiveCallToAction,
    queuedActionEvents: state.queuedActionEvents,
    popActionQueue: state.popActionQueue,
  }));
  const currentNode = getCurrentNode(dialogue, nodeId);
  const navigate = useNavigate();
  const { sessionId } = useSession();

  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') {
      logAction({
        sessionId,
        toNodeId: currentNode.id,
        eventType: SessionEventType.Navigation,
        timestamp: new Date(),
      })
    }
  }, [sessionId, currentNode, navigationType, logAction]);

  // Upload every 2000 ms the events (to batch them).
  // - TODO: The uploader should be a three-stage process, to be resilient to network errors.:
  // - 1. Upload the events to the main API
  // - 2. If the event does not land at the API, send it to an alternative API Gateway
  // - 3. If the event does not land at the alternative API, send it as an error message to Sentry.

  useDebouncedEffect(() => {
    if (queuedActionEvents.length > 0) {
      const actionEvents = popActionQueue();
      onEventUpload?.(actionEvents);
    }
  }, [queuedActionEvents.length, popActionQueue, sessionId], 2000);

  const QuestionNode = NodeComponent[currentNode.type];

  const handleRunAction = (input: RunActionInput) => {
    logAction(input.event);
    setActiveCallToAction(input.activeCallToAction);

    if (input.event.toNodeId) {
      navigate(`n/${input.event.toNodeId}`);
    } else {
      navigate(`n/cta`);
    }
  }

  return (
    <QuestionNode node={currentNode} onRunAction={handleRunAction}  />
  )
};
