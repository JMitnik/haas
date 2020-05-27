import React from 'react';
import { useParams } from 'react-router-dom';
import NodeLayout from 'components/Nodes/NodeLayout';
import { HAASNode } from 'types/generic';
import SliderNode from 'components/Nodes/SliderNode/SliderNode';
import MultiChoiceNode from 'components/Nodes/MultiChoiceNode/MultiChoiceNode';
import TextboxNode from 'components/Nodes/TextboxNode/TextboxNode';
import SocialShareNode from 'components/Nodes/SocialShareNode/SocialShareNode';
import RegisterNode from 'components/Nodes/RegisterNode/RegisterNode';
import FinishNode from 'components/Nodes/FinishNode/FinishNode';
import Loader from 'components/Loader';
import useDialogueTree from 'providers/DialogueTreeProvider';
import DialogueTreeLayout from 'components/DialogueTreeLayout';

export interface GenericNodeProps {
  isLeaf?: boolean;
  node: HAASNode;
}

const nodeMap: Record<string, (props: GenericNodeProps) => JSX.Element> = {
  SLIDER: SliderNode,
  MULTI_CHOICE: MultiChoiceNode,
  TEXTBOX: TextboxNode,
  SOCIAL_SHARE: SocialShareNode,
  REGISTRATION: RegisterNode,
  FINISH: FinishNode
};

const NodeType = ({ isLeaf, node }: GenericNodeProps) => {
  const Component = nodeMap[node?.type || 'Slider'];

  // Actually, return
  if (!Component) {
    return <Loader />;
  }

  return <Component isLeaf={isLeaf} node={node} />;
};

const NodePage = () => {
  const { edgeId, leafId } = useParams<{ edgeId?: string, leafId?: string }>();
  const { treeDispatch: { getActiveNode, getActiveLeaf } } = useDialogueTree();

  let activeNode = null;
  activeNode = getActiveNode(edgeId);
  if (leafId) activeNode= getActiveLeaf(leafId);

  if (!activeNode) return <Loader />

  return (
    <DialogueTreeLayout>
      <NodeLayout activeNode={activeNode}>
        <NodeType node={activeNode} />
      </NodeLayout>
    </DialogueTreeLayout>
  );
}

export default NodePage;
