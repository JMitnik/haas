import { useStore } from "components/Dialogue/DialogueRouter";
import { QuestionNodeProps } from "components/QuestionNode/QuestionNodeTypes";
import { useSession } from "components/Session/SessionProvider";
import { useRef } from "react";
import { SessionEventType } from "types/generated-types";
import { findSliderChildEdge } from "./findSliderChildEdge";

export const SliderNode = ({ node, onRunAction }: QuestionNodeProps) => {
  const ref = useRef<HTMLInputElement>();
  const { sessionId } = useSession();
  const { activeCallToAction } = useStore(state => ({
    activeCallToAction: state.activeCallToAction
  }));

  /**
   * Handles a sliding action: find child and pass that child to par
   */
  const handleRunAction = () => {
    const sliderValue = parseInt(ref.current.value, 10);
    const nextEdge = findSliderChildEdge(sliderValue, node.children);
    const nextNodeId = nextEdge.childNode.id || activeCallToAction.id;

    onRunAction({
      event: {
        sessionId,
        toNodeId: nextNodeId,
        eventType: SessionEventType.SliderAction,
        sliderValue: {
          relatedNodeId: node.id,
          value: sliderValue,
          // TODO: Measure
          timeSpent: 0,
        },
        timestamp: new Date(),
      },
      activeCallToAction: node.overrideLeaf,
    })
  };

  return (
    <form onSubmit={(e) => {e.preventDefault(); handleRunAction()}}>
      <input ref={ref} type="range" min="0" max="100" name="slider" />
      <button>Submit</button>
    </form>
  )
}
