import React, { useCallback } from 'react';
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

  const renderNode = useCallback((item) => {
    return renderNextNode(item)
  }, [activeNode]);

  return (
    <Div useFlex flexDirection='column' justifyContent='space-between' height={['100vh', '75vh']}>
      <H1 textAlign="center" color="white">{activeNode?.title}</H1>

      {transitions.map(({ item, key, props, state }) => {
        // const node = renderNextNode(item.type)
        // console.log('Item: ', props)
        if (state !== 'leave') {
          return <animated.div style={{
            position: 'absolute',
            bottom: '100px',
            left: 0,
            right: 0,
            ...props,
          }} key={key}
          >
            {renderNextNode(item.type)}
          </animated.div>
        }
        return null

      }

      )}
    </Div>
  );
};

HAASForm.whyDidYouRender = true;

const renderNextNode = (node: any) => {
  let nodeType = node.type;
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
