import React from 'react';
import useHAASTree from 'providers/dialogue-tree-provider';
import { HAASNode } from 'providers/dialogue-provider';
import { Loader } from '@haas/ui';
import SliderNode from 'components/Nodes/SliderNode/SliderNode';
import MultiChoiceNode from 'components/Nodes/MultiChoiceNode/MultiChoiceNode';
import TextboxNode from 'components/Nodes/TextboxNode/TextboxNode';
import SocialShareNode from 'components/Nodes/SocialShareNode/SocialShareNode';
import RegisterNode from 'components/Nodes/RegisterNode/RegisterNode';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveNodeContainer, FloatingNodeContainer } from './NodeStyles';
import FinishNode from 'components/Nodes/FinishNode/FinishNode';

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

const Node = () => {
  const {
    treeState: { activeNode }
  } = useHAASTree();

  const renderActiveNode = (props: GenericNodeProps) => {
    const Component = nodeMap[activeNode?.type || 'Slider'];

    if (!Component) {
      return <Loader />;
    }

    return <Component {...props} />;
  };

  return (
    <>
      <AnimatePresence>
        <FloatingNodeContainer key={activeNode?.id}>
          <motion.div
            key={activeNode?.id}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            style={{ display: 'flex', width: '100%' }}
          >
            <ActiveNodeContainer>
              {activeNode && renderActiveNode({ node: activeNode })}
            </ActiveNodeContainer>
          </motion.div>
        </FloatingNodeContainer>
      </AnimatePresence>
    </>
  );
};

export default Node;
