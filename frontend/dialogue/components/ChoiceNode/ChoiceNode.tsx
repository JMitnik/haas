import { ActionType, useStore } from 'components/Dialogue/DialogueRouter';
import { QuestionNodeProps } from 'components/QuestionNode/QuestionNodeTypes';
import { findChoiceChildEdge } from './findChoiceChildEdge';


/**
 * ChoiceNode: dialogue segment where a button press leads to the next item.
 */
export const ChoiceNode = ({ node, onRunAction }: QuestionNodeProps) => {
  const choices = node.options || [];

  const { activeCallToAction } = useStore(state => ({
    activeCallToAction: state.activeCallToAction
  }));

  const handleRunAction = (choiceIndex: number) => {
    const choice = choices[choiceIndex];
    const childEdge = findChoiceChildEdge(choice, node.children);
    const childNode = childEdge?.childNode || activeCallToAction;
    console.log(childNode);

    onRunAction({
      event: {
        timestamp: new Date(),
        to: childNode?.id,
        value: {
          actionType: ActionType.CHOICE_ACTION,
          choiceValue: {
            nodeId: node.id,
            optionId: choice.id.toString(),
            value: choice.value,
            timeSpent: 0,
          }
        }
      },
      activeCallToAction: choice.overrideLeaf || node.overrideLeaf,
    });
  }

  return (
    <div>
      {node.title}

      {choices.map((choice, index) => (
        <button
          style={{ margin: '10px' }}
          key={index}
          onClick={() => handleRunAction(index)}
        >
          {choice.value}
        </button>
      ))}
    </div>
  )
}
