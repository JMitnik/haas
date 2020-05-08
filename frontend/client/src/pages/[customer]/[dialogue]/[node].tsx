import React from 'react';
import { useParams, Redirect } from 'react-router-dom';
import NodeLayout from 'components/Nodes/NodeLayout';
import { HAASNode } from 'types/generic';
import SliderNode from 'components/Nodes/SliderNode/SliderNode';
import MultiChoiceNode from 'components/Nodes/MultiChoiceNode/MultiChoiceNode';
import TextboxNode from 'components/Nodes/TextboxNode/TextboxNode';
import SocialShareNode from 'components/Nodes/SocialShareNode/SocialShareNode';
import RegisterNode from 'components/Nodes/RegisterNode/RegisterNode';
import FinishNode from 'components/Nodes/FinishNode/FinishNode';
import Loader from 'components/Loader';
import useHAASTree from 'providers/dialogue-tree-provider';

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
  const params = useParams<{ edgeId: string }>();
  const { treeState: { activeNode } } = useHAASTree();

  if (!params) {}

  return (
    <NodeLayout activeNode={activeNode}>
      {/* <NodeType /> */}
    </NodeLayout>
  );
}

export default NodePage;
