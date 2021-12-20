import * as UI from '@haas/ui';

import { useStore } from 'components/Dialogue/DialogueRouter';
import { NodeLayout } from 'components/QuestionNode/NodeLayout';
import { QuestionNodeTitle } from 'components/QuestionNode/QuestionNodeStyles';
import { QuestionNodeProps } from 'components/QuestionNode/QuestionNodeTypes';
import { useSession } from 'components/Session/SessionProvider';
import { SessionEventType } from 'types/generated-types';
import { ChoiceNodeButtonLayout } from './ChoiceNodeButtonLayout';
import { findChoiceChildEdge } from './findChoiceChildEdge';


/**
 * ChoiceNode: dialogue segment where a button press leads to the next item.
 */
export const ChoiceNode = ({ node, onRunAction }: QuestionNodeProps) => {
  const { sessionId } = useSession();
  const choices = node.options || [];

  const { activeCallToAction } = useStore(state => ({
    activeCallToAction: state.activeCallToAction
  }));

  const handleRunAction = (choiceIndex: number) => {
    const choice = choices[choiceIndex];
    const childEdge = findChoiceChildEdge(choice, node.children);
    const childNode = childEdge?.childNode || activeCallToAction;
    console.log({ activeCallToAction, childNode });
    onRunAction({
      event: {
        sessionId,
        timestamp: new Date(),
        toNodeId: childNode?.id,
        eventType: SessionEventType.ChoiceAction,
        choiceValue: {
          relatedNodeId: node.id,
          optionId: `${choice.id}`,
          value: choice.value,
          timeSpent: 0,
        }
      },
      activeCallToAction: choice.overrideLeaf || node.overrideLeaf || activeCallToAction,
    });
  }

  return (
    <NodeLayout node={node}>
      <QuestionNodeTitle>
        {node.title}
      </QuestionNodeTitle>

      <ChoiceNodeButtonLayout node={node}>
        {choices.map((choice, index) => (
          <UI.GradientButton
          style={{ margin: '10px' }}
          key={index}
          onClick={() => handleRunAction(index)}
          >
            {choice.value}
          </UI.GradientButton>
        ))}
      </ChoiceNodeButtonLayout>
    </NodeLayout>
  )
}
