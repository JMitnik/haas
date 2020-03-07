import React from 'react';
import styled, { css } from 'styled-components';
import { FormContext, useForm } from 'react-hook-form';
import { H1, Div, Loader } from '@haas/ui';
import { useJSONTree } from '../hooks/use-json-tree';
import { useTransition, animated } from 'react-spring';
import { HAASSlider } from './HAASSlider';
import { HAASMultiChoice } from './HAASMultiChoice';
import { HAASSocialShare } from './HAASSocialShare';
import { HAASTextBox } from './HAASTextBox';
import { HAASSignIn } from './HAASSignIn';

export const HAASForm = () => {
  const { historyStack } = useJSONTree();
  const activeNode = historyStack.slice(-1)[0];
  const form = useForm();

  const transitions = useTransition(activeNode, (activeNode) => activeNode?.id, {
    from: { opacity: 0, transform: 'scale(1.1)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' }
  });

  if (!activeNode) return <Loader />;

  return (
    <FormContext {...form}>
      <Div useFlex flexDirection='column' justifyContent='space-between' height={['100vh', '80vh']}>
        <H1 textAlign="center" color="white">{activeNode?.title}</H1>
        {/* <img src={customer.settings.logoUrl} alt="Logo" /> */}
        {transitions.map(({ item, key, props, state }) => {
          if (state !== 'leave') {
            return <Entry style={{
              ...props,
            }} key={key}
            >
              {renderNextNode(item)}
            </Entry>
          }
          return null;
        })}
      </Div>
    </FormContext>
  );
};

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
  console.log('node', node);
  let nodeType = node.questionType || node.questionType?.type || node.type?.type || '';
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
