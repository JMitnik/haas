import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components/macro';
import { Container, Loader, Div } from '@haas/ui';

import useHAASTree from 'hooks/use-haas-tree';
import useQuestionnaire from 'hooks/use-questionnaire';
import { QuestionnaireContainer, NodeContainer } from './QuestionnaireStyles';
import { makeCustomTheme } from 'utils/makeCustomerTheme';
import SliderNode from './nodes/SliderNode/SliderNode';
import MultiChoiceNode from './nodes/MultiChoiceNode/MultiChoiceNode';
import TextboxNode from './nodes/TextboxNode/TextboxNode';
import SocialShareNode from './nodes/SocialShareNode/SocialShareNode';
import RegisterNode from './nodes/RegisterNode/RegisterNode';
import { GenericNodeProps } from './nodes/Node';
import { Switch, useLocation, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const nodeMap: Record<string, (props: GenericNodeProps) => JSX.Element> = {
  SLIDER: SliderNode,
  MULTI_CHOICE: MultiChoiceNode,
  TEXTBOX: TextboxNode,
  SOCIAL_SHARE: SocialShareNode,
  REGISTRATION: RegisterNode
};

const QuestionnaireTree = () => {
  const { customer } = useQuestionnaire();
  const location = useLocation();

  const { activeNode, isAtLeaf } = useHAASTree();

  const renderActiveNode = () => {
    const Component = nodeMap[activeNode?.type || 'Slider'];

    if (!Component) {
      return <Loader />;
    }

    return <Component isLeaf={isAtLeaf} />;
  };

  if (!customer) return <Loader />;

  return (
    <QuestionnaireContainer>
      <NodeContainer useFlex flex="100%" alignItems="stretch">
        <AnimatePresence exitBeforeEnter initial={false}>
          <Switch location={location} key={location.pathname}>
            <Route path={`/c/:customerId/q/:questionnaireId/finished`}>
              <motion.div>
                <Div>Busy</Div>
              </motion.div>
            </Route>
            <Route path={`/c/:customerId/q/:questionnaireId/e/:edgeId`}>
              <motion.div exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {renderActiveNode()}
              </motion.div>
            </Route>
            <Route path={`/c/:customerId/q/:questionnaireId`}>
              <motion.div exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {renderActiveNode()}
              </motion.div>
            </Route>
          </Switch>
        </AnimatePresence>
      </NodeContainer>
    </QuestionnaireContainer>
  );
};

export default QuestionnaireTree;
