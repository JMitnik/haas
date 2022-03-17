import * as UI from '@haas/ui';
import { useRef } from 'react';

import { QuestionNodeLayout } from '../QuestionNode/QuestionNodeLayout';
import { SessionActionType } from '../../types/core-types';
import { useSession } from '../Session/SessionProvider';
import { ChoiceNodeButtonLayout } from './ChoiceNodeButtonLayout';
import { findChoiceChildEdge } from './findChoiceChildEdge';
import { QuestionNodeTitle } from '../QuestionNode/QuestionNodeTitle';
import { QuestionNodeProps } from '../QuestionNode/QuestionNodeTypes';
import { GradientButton } from '../Button/GradientButton';

/**
 * ChoiceNode: dialogue segment where a button press leads to the next item.
 */
export const ChoiceNode = ({ node, onRunAction }: QuestionNodeProps) => {
  const { sessionId } = useSession();
  const choices = node.options || [];
  const startTime = useRef(Date.now());

  const handleRunAction = (choiceIndex: number) => {
    const choice = choices[choiceIndex];
    const childEdge = findChoiceChildEdge(choice, node.children);
    const childNode = childEdge?.childNode;

    onRunAction({
      sessionId,
      timestamp: Date.now(),
      action: {
        type: SessionActionType.ChoiceAction,
        choice: {
          value: choice.value,
          choiceId: choice.id.toString(),
        },
        timeSpent: Math.floor(Date.now() - startTime.current),
      },
      reward: {
        overrideCallToActionId: choice.overrideLeaf?.id || node.overrideLeaf?.id,
        toEdge: childEdge?.id,
        toNode: childNode?.id,
      },
    });
  }

  return (
    <QuestionNodeLayout node={node}>
      <QuestionNodeTitle>
        {node.title}
      </QuestionNodeTitle>

      <ChoiceNodeButtonLayout node={node}>
        {choices.map((choice, index) => (
          <GradientButton
            style={{ margin: '10px' }}
            key={index}
            onClick={() => handleRunAction(index)}
          >
            {choice.value}
          </GradientButton>
        ))}
      </ChoiceNodeButtonLayout>
    </QuestionNodeLayout>
  )
}
