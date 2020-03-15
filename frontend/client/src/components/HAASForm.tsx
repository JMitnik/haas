import React from 'react';
import styled, { css } from 'styled-components';
import { FormContext, useForm } from 'react-hook-form';
import { H1, Div, Loader } from '@haas/ui';
import { useHAASTree, HAASNode } from '../hooks/use-haas-tree';
import { useTransition, animated } from 'react-spring';
import { HAASSlider } from './HAASSlider';
import { HAASMultiChoice } from './HAASMultiChoice';
import { HAASSocialShare } from './HAASSocialShare';
import { HAASTextBox } from './HAASTextBox';
import { HAASSignIn } from './HAASSignIn';
import { AnimatePresence, motion } from 'framer-motion';

export const HAASForm = () => {
  const form = useForm({
    mode: 'onChange',
  });

  const pageVariants = {
    initial: {
      opacity: 0,
    },
    in: {
      opacity: 1,
    },
    out: {
      opacity: 0,
    }
  };

  return (
    <FormContext {...form}>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
      >
        <HAASTreeComponent />
      </motion.div>
    </FormContext>
  );
};

const HAASTreeComponent = () => {
  const { nodeHistoryStack, isAtLeaf } = useHAASTree();
  const activeNode = nodeHistoryStack.slice(-1)[0];

  if (isAtLeaf) return <LeafNodeView />
  if (!activeNode) return <Loader />;

  return <HAASNodeView />;
};

const HAASNodeView = () => {
  const { nodeHistoryStack } = useHAASTree();
  const activeNode = nodeHistoryStack.slice(-1)[0];

   const pageVariants = {
    initial: {
      opacity: 0,
    },
    in: {
      opacity: 1,
    },
  };

  return (
    <Div useFlex flexDirection='column' justifyContent='space-between' height={['100vh', '80vh']}>
        <H1 textAlign="center" color="white">{activeNode?.title}</H1>

        <motion.div
          initial="initial"
          animate="in"
          variants={pageVariants}
          key={activeNode.id}
          transition={{ duration: 0.5 }}
        >
            <Entry >
              {renderNextNode(activeNode)}
            </Entry>
          </motion.div>
  </Div>
  )
}

const LeafNodeView = () => {
  const { getActiveLeaf } = useHAASTree();
  const leaf = getActiveLeaf();

  return (
    <Div useFlex flexDirection='column' justifyContent='space-between' height={['100vh', '80vh']}>
      <H1 textAlign="center" color="white">{leaf?.title}</H1>
      <Div position="relative">
        {renderLeaf(leaf)}
      </Div>
    </Div>
  );
}

const Entry = styled(animated.div)`
  ${({ theme }) => css`
    position: absolute;
    left: 0;
    right: 0;

    @media ${theme.media.mob} {
      bottom: 30px;
    }

    @media ${theme.media.desk} {
      bottom: 100px;
    }
  `}
`;

const renderNextNode = (node: any) => {
  if (node) {
    let nodeType = node.questionType || node.questionType?.type;
    const Component: React.ReactNode | undefined = nodeMap.get(nodeType);

    return Component || <HAASTextBox />
  }

  return null;
};

const renderLeaf = (leaf: HAASNode | null) => {
  if (leaf?.type) {
    const Component: React.ReactNode | undefined = leafMap.get(leaf?.type);

    return Component;
  }

  return <HAASTextBox isLeaf />
}

const nodeMap = new Map([
  ['SLIDER', <HAASSlider />],
  ['MULTI_CHOICE', <HAASMultiChoice />],
  ['TEXTBOX', <HAASTextBox />],
]);

const leafMap = new Map([
  ['SOCIAL_SHARE', <HAASSocialShare isLeaf />],
  ['REGISTRATION', <HAASSignIn isLeaf />],
  ['TEXTBOX', <HAASTextBox isLeaf />],
]);
