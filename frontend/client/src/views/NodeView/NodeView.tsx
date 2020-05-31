import React from 'react';

import { HAASNode } from 'types/generic';
import { Loader } from '@haas/ui';
import { TreeNodeProps } from 'models/TreeNodeModel';
import { Variants, motion } from 'framer-motion';
import DialogueTreeLayout from 'components/DialogueTreeLayout';
import FinishNode from 'components/Nodes/FinishNode/FinishNode';
import MultiChoiceNode from 'components/Nodes/MultiChoiceNode/MultiChoiceNode';
import NodeLayout, { GenericNodeProps } from 'components/Nodes/NodeLayout/NodeLayout';
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

const nodeViewAnimation: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
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
