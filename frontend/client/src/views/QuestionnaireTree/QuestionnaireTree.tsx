import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components/macro';
import { Container, Loader } from '@haas/ui';

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

const nodeMap: Record<string, (props: GenericNodeProps) => JSX.Element> = {
  SLIDER: SliderNode,
  MULTI_CHOICE: MultiChoiceNode,
  TEXTBOX: TextboxNode,
  SOCIAL_SHARE: SocialShareNode,
  REGISTRATION: RegisterNode
};

const QuestionnaireTree = () => {
  const { customer } = useQuestionnaire();
  const [customTheme, setCustomTheme] = useState({});

  const { activeNode } = useHAASTree();

  // Customize app for customer
  useEffect(() => {
    if (customer?.name) {
      window.document.title = `${customer.name} | Powered by HAAS`;
    }

    if (customer?.settings) {
      const customerTheme = { colors: customer?.settings?.colourSettings };
      setCustomTheme(customerTheme);
    }
  }, [customer]);

  const renderActiveNode = () => {
    const Component = nodeMap[activeNode?.type || 'Slider'];
    console.log('activeNode', activeNode);

    if (!Component) {
      return <Loader />;
    }

    console.log('Component', Component);

    return <Component />;
  };

  if (!customer) return <Loader />;

  return (
    <ThemeProvider theme={(theme: any) => makeCustomTheme(theme, customTheme)}>
      <QuestionnaireContainer>
        <NodeContainer useFlex flex="100%" alignItems="stretch">
          {renderActiveNode()}
        </NodeContainer>
      </QuestionnaireContainer>
    </ThemeProvider>
  );
};

export default QuestionnaireTree;
