import React, { useEffect } from 'react'

import { Dialogue, Workspace, QuestionNode as QuestionNodeType } from 'types/helper-types';
import { QuestionNodeTypeEnum } from 'types/generated-types';
import { SliderNode } from 'components/SliderNode/SliderNode';
import { ChoiceNode } from 'components/ChoiceNode/ChoiceNode';
import { ActionType, useStore } from 'components/Dialogue/DialogueRouter';

import { QuestionNodeProps as GenericQuestionNodeProps, RunActionInput } from './QuestionNodeTypes';
import { useNavigate, useNavigationType, useParams } from 'react-router';

interface QuestionNodeProps {
  dialogue: Dialogue;
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

export const QuestionNodeRenderer = ({ dialogue }: QuestionNodeProps) => {
  const { nodeId } = useParams();
  const { setActiveCallToAction, logAction, getCurrentNode, actionEvents } = useStore(state => ({
    activeCallToAction: state.activeCallToAction,
    getCurrentNode: state.getCurrentNode,
    actionEvents: state.actionEvents,
    logAction: state.logAction,
    setActiveCallToAction: state.setActiveCallToAction,
  }));
  const currentNode = getCurrentNode(dialogue, nodeId);
  const navigate = useNavigate();

  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') {
      logAction({
        to: currentNode.id,
        value: { actionType: ActionType.NAVIGATION },
        timestamp: new Date(),
      })
    }
  }, [currentNode, navigationType, logAction]);

  // TODO: Should be debounced, upload in batch to prevent server-overload
  useEffect(() => {
    if (actionEvents.length > 0) {
      console.log('should upload to session');
    }
  }, [actionEvents])

  const QuestionNode = NodeComponent[currentNode.type];

  const handleRunAction = (input: RunActionInput) => {
    logAction(input.event);
    setActiveCallToAction(input.activeCallToAction);

    if (input.event.to) {
      navigate(`n/${input.event.to}`);
    } else {
      navigate(`n/cta`);
    }
  }

  return (
    <QuestionNode node={currentNode} onRunAction={handleRunAction}  />
  )
};
