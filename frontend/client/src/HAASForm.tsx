import React from 'react';
import { H1, Div } from '@haas/ui';
import { useJSONTree } from './hooks/use-json-tree';
import { useTransition, animated } from 'react-spring';
import { HAASSlider } from './components/HAASSlider';
import { HAASMultiChoice } from './components/HAASMultiChoice';
import { HAASSocialShare } from './components/HAASSocialShare';
import { HAASTextBox } from './components/HAASTextBox';
import { HAASSignIn } from './components/HAASSignIn';

export const HAASForm = () => {
  const { historyStack } = useJSONTree();
  const activeNode = historyStack.slice(-1)[0];

  const transitions = useTransition(activeNode, (activeNode) => activeNode?.id, {
    from: { opacity: 0, transform: 'scale(1.1)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' }
  });

  return (
    <Div useFlex flexDirection='column' justifyContent='space-between' height={['100vh', '80vh']}>
      <H1 textAlign="center" color="white">{activeNode?.title}</H1>

      {transitions.map(({ item, key, props, state }) => {
        if (state !== 'leave') {
          return <animated.div style={{
            position: 'absolute',
            bottom: '100px',
            left: 0,
            right: 0,
            ...props,
          }} key={key}
          >
            {renderNextNode(item)}
          </animated.div>
        }
        return null

      }

      )}
    </Div>
  );
};

const renderNextNode = (node: any) => {
  let nodeType = node.questionType || node.questionType.type || node.type?.type || '';
  const Component: React.ReactNode | undefined = nodeMap.get(nodeType);

  return Component || <HAASTextBox />
}

const nodeMap = new Map([
  ['SLIDER', <HAASSlider />],
  ['MULTI_CHOICE', <HAASMultiChoice />],
  ['SOCIAL_SHARE', <HAASSocialShare />],
  ['TEXTBOX', <HAASTextBox />],
  ['REGISTRATION', <HAASSignIn />]
]);
