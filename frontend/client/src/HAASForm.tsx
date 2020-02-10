import React from 'react';
import { H1, H5, Slider, Flex, ColumnFlex, Button, Div } from '@haas/ui';
import { useFormContext } from 'react-hook-form';
import { useJSONTree, MultiChoiceOption } from './hooks/use-json-tree';
import { useTransition, animated } from 'react-spring';
import { HAASSlider } from './components/HAASSlider';
import { HAASMultiChoice } from './components/HAASMultiChoice';
import { HAASSocialShare } from './components/HAASSocialShare';
import { HAASTextBox } from './components/HAASTextBox';
import { HAASSignIn } from './components/HAASSignIn';

export const HAASForm = () => {
  const { activeNode } = useJSONTree();

  const transitions = useTransition(activeNode, (activeNode) => activeNode.id, {
    from: { opacity: 0, transform: 'scale(1.1)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' },
  });

  console.log(transitions);

  return (
    <Div useFlex flexDirection='column' justifyContent='space-between' height={['100vh', '75vh']}>
      <H1 textAlign="center" color="white">{activeNode.title}</H1>

      {transitions.map(({ item, key, props }) => (
        <animated.div style={{
          position: 'absolute',
          bottom: '100px',
          left: 0,
          right: 0,
          ...props,
          }} key={key}
        >
          {renderNextNode(item.type)}
        </animated.div>
      ))}
    </Div>
  );
};

const renderNextNode = (nodeType: string) => {
  const Component: React.ReactNode | undefined = nodeMap.get(nodeType);

  return Component || <HAASTextBox />
}

const nodeMap = new Map([
  ['slider', <HAASSlider />],
  ['multi-choice', <HAASMultiChoice />],
  ['social-share', <HAASSocialShare />],
  ['textbox', <HAASTextBox />],
  ['registration', <HAASSignIn />]
]);
