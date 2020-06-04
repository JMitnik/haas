import React from 'react';

import { GenericNodeProps } from 'components/Nodes/NodeLayout/NodeLayout';
import { Loader } from '@haas/ui';
import { TreeNodeProps } from 'models/Tree/TreeNodeModel';
import DialogueTreeLayout from 'components/DialogueTreeLayout';
import FinishNode from 'components/Nodes/FinishNode/FinishNode';
import MultiChoiceNode from 'components/Nodes/MultiChoiceNode/MultiChoiceNode';
import RegisterNode from 'components/Nodes/RegisterNode/RegisterNode';
import SliderNode from 'components/Nodes/SliderNode/SliderNode';
import SocialShareNode from 'components/Nodes/SocialShareNode/SocialShareNode';
import TextboxNode from 'components/Nodes/TextboxNode/TextboxNode';

const nodeMap: Record<string, (props: GenericNodeProps) => JSX.Element> = {
  SLIDER: SliderNode,
  MULTI_CHOICE: MultiChoiceNode,
  TEXTBOX: TextboxNode,
  SOCIAL_SHARE: SocialShareNode,
  REGISTRATION: RegisterNode,
  FINISH: FinishNode,
};

const NodeType = ({ isLeaf, node }: GenericNodeProps) => {
  const Component = nodeMap[node?.type || 'Slider'];

  if (!Component) {
    return <Loader />;
  }

  return <Component isLeaf={isLeaf} node={node} />;
};

interface NodeViewProps {
  node: TreeNodeProps;
}

const NodeView = ({ node }: NodeViewProps) => (
  <DialogueTreeLayout>
    <NodeType node={node} />
  </DialogueTreeLayout>
);

export default NodeView;
