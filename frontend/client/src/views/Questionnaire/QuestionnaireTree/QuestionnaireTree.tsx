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
import Node, { GenericNodeProps } from './nodes/Node';
import { Switch, useLocation, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const QuestionnaireTree = () => {
  const { customer } = useQuestionnaire();
  const location = useLocation();

  if (!customer) return <Loader />;

  return (
    <QuestionnaireContainer>
      <NodeContainer useFlex flex="100%" alignItems="stretch">
        <AnimatePresence exitBeforeEnter initial={false}>
          <Node />
        </AnimatePresence>
      </NodeContainer>
    </QuestionnaireContainer>
  );
};

export default QuestionnaireTree;
