import React, { useCallback, useEffect } from 'react'
import { useNavigationType, useParams } from 'react-router';

import { Dialogue, SessionEventInput } from '../../types/helper-types';
import { useEventsStore } from '../DialogueEventsStore/DialogueEventsStore';
import { QuestionNodeTypeEnum, SessionEventType } from '../../types/generated-types';
import { SliderNode } from '../SliderNode/SliderNode';
import { ChoiceNode } from '../ChoiceNode/ChoiceNode';
import { useSession } from '../Session/SessionProvider';
import { LinkNode } from '../LinkNode/LinkNode';
import FormNode from '../FormNode/FormNode';
import { useNavigator } from '../Navigation/useNavigator';
import { QuestionNodeProps as GenericQuestionNodeProps, RunActionInput } from './QuestionNodeTypes';

interface QuestionNodeProps {
  dialogue: Dialogue;
  onEventUpload: (events: SessionEventInput[]) => void;
}

const NodeComponent: { [key in QuestionNodeTypeEnum]?: React.FC<GenericQuestionNodeProps> } = {
  [QuestionNodeTypeEnum.Slider]: SliderNode,
  [QuestionNodeTypeEnum.Choice]: ChoiceNode,
  [QuestionNodeTypeEnum.Textbox]: ChoiceNode,
  [QuestionNodeTypeEnum.Form]: FormNode,
  [QuestionNodeTypeEnum.Link]: LinkNode,
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
  const { workspace: workspaceSlug, dialogue: dialogueSlug, nodeId } = useParams();
  const {
    popActionQueue,
    queuedActionEvents,
    setActiveCallToAction,
    logAction,
    getCurrentNode,
  } = useEventsStore(state => ({
    activeCallToAction: state.activeCallToAction,
    getCurrentNode: state.getCurrentNode,
    actionEvents: state.actionEvents,
    logAction: state.logAction,
    setActiveCallToAction: state.setActiveCallToAction,
    queuedActionEvents: state.queuedActionEvents,
    popActionQueue: state.popActionQueue,
  }));
  const currentNode = getCurrentNode(dialogue, nodeId);
  const { sessionId } = useSession();
  const { transition } = useNavigator({ dialogueSlug, workspaceSlug });

  const navigationType = useNavigationType();

  // If user went back or forward in their browser, track it as a Navigation action.
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

  // TODO: Make this work
//   useEffect(() => {
//     return () => {
//        window.addEventListener("beforeunload", function(e) {
//           if (queuedActionEvents.length > 0) {
//             const actionEvents = popActionQueue();
//             onEventUpload?.(actionEvents);
//           }
//        });
//     }
//  });

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

  const handleRunAction = useCallback((input: RunActionInput) => {
    logAction(input.event);

    // We cannot unset an active-call-to-action momentarily, only override it.
    const activeCallToAction = setActiveCallToAction(input.activeCallToAction);

    transition({
      activeCallToActionId: activeCallToAction?.id,
      childNodeId: input.event.toNodeId,
      currentNodeId: currentNode.id,
    });
  }, [logAction, setActiveCallToAction, transition, currentNode]);

  return (
    <QuestionNode node={currentNode} onRunAction={handleRunAction}  />
  )
};
