import { ActionType, useStore } from "components/Dialogue/DialogueRouter";
import { QuestionNodeProps } from "components/QuestionNode/QuestionNodeTypes";
import { findSliderChildEdge } from "./findSliderChildEdge";

export const SliderNode = ({ node, onRunAction }: QuestionNodeProps) => {
  const { activeCallToAction } = useStore(state => ({
    activeCallToAction: state.activeCallToAction
  }));

  /**
   * Handles a sliding action: find child and pass that child to par
   */
  const handleRunAction = (sliderValue: number) => {
    const nextEdge = findSliderChildEdge(sliderValue, node.children);
    const nextNodeId = nextEdge.childNode.id || activeCallToAction.id;

    onRunAction({
      event: {
        to: nextNodeId,
        value: {
          actionType: ActionType.SLIDER_ACTION,
          sliderValue: {
            value: sliderValue,
            nodeId: node.id,
            timeSpent: 0,
          }
        },
        timestamp: new Date(),
      },
      activeCallToAction: node.overrideLeaf,
    })
  };

  return (
    <form onSubmit={(e) => {e.preventDefault(); handleRunAction(e.target.slider.value)}}>
      <input type="range" min="0" max="100" name="slider" />
      <button>Submit</button>
    </form>
  )
}
