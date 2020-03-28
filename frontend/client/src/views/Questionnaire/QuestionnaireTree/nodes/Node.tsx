import React, { useCallback } from 'react';
import useHAASTree from 'hooks/use-haas-tree';
import { HAASNode, HAASFormEntry } from 'hooks/use-questionnaire';
import { Loader } from '@haas/ui';
import SliderNode from './SliderNode/SliderNode';
import MultiChoiceNode from './MultiChoiceNode/MultiChoiceNode';
import TextboxNode from './TextboxNode/TextboxNode';
import SocialShareNode from './SocialShareNode/SocialShareNode';
import RegisterNode from './RegisterNode/RegisterNode';
import { motion } from 'framer-motion';

export interface GenericNodeProps {
  isLeaf?: boolean;
  node: HAASNode;
}

const nodeMap: Record<string, (props: GenericNodeProps) => JSX.Element> = {
  SLIDER: SliderNode,
  MULTI_CHOICE: MultiChoiceNode,
  TEXTBOX: TextboxNode,
  SOCIAL_SHARE: SocialShareNode,
  REGISTRATION: RegisterNode
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
      <motion.div
        key={activeNode?.id}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 1 }}
      >
        {activeNode && renderActiveNode({ node: activeNode })}
      </motion.div>
    </>
  );
};

export default Node;
