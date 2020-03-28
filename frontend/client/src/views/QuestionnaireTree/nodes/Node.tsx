import React, { useCallback } from 'react';
import styled, { css } from 'styled-components/macro';
import useHAASTree from 'hooks/use-haas-tree';
import { HAASNode, HAASFormEntry } from 'hooks/use-questionnaire';
import { Loader, Div } from '@haas/ui';
import SliderNode from './SliderNode/SliderNode';
import MultiChoiceNode from './MultiChoiceNode/MultiChoiceNode';
import TextboxNode from './TextboxNode/TextboxNode';
import SocialShareNode from './SocialShareNode/SocialShareNode';
import RegisterNode from './RegisterNode/RegisterNode';
import { motion, AnimatePresence } from 'framer-motion';

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
      <AnimatePresence>
        <NodeContainer key={activeNode?.id}>
          <motion.div
            key={activeNode?.id}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
          >
            {activeNode && renderActiveNode({ node: activeNode })}
          </motion.div>
        </NodeContainer>
      </AnimatePresence>
    </>
  );
};

const NodeContainer = styled(Div)`
  position: absolute;
`;

export default Node;
