import React from 'react';
import { H1, H5, Slider, Flex, ColumnFlex, Button, Div } from '@haas/ui';
import { useFormContext } from 'react-hook-form';
import { useJSONTree, MultiChoiceOption } from './hooks/use-json-tree';
import { Instagram } from 'react-feather';
import { useTransition, animated } from 'react-spring';

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

export const HAASMultiChoice = () => {
  const { activeNode, goToChild } = useJSONTree();

  console.log("TCL: HAASMultiChoice -> activeNode", activeNode)

  return (
    <>
      <Flex flexWrap="wrap">
        {activeNode?.options?.map((multiChoiceOption: MultiChoiceOption, index: any) => (
          <Div key={index} fillChildren padding={4} flex={0.5}>
            <Button brand="primary" onClick={() => goToChild(multiChoiceOption.value)} key={index}>
              <H5>
                {(multiChoiceOption?.publicValue?.length ?? 0) > 0 ? multiChoiceOption?.publicValue : multiChoiceOption?.value}
              </H5>
            </Button>
          </Div>
        ))}
      </Flex>
    </>
  )
};

export const HAASSocialShare = () => {
  return (
    <>
      <Instagram />
    </>
  )
}

export const HAASText = () => {
  const { goToChild } = useJSONTree();
  return (
    <>
      <Flex>
        <input></input>
        <Button onClick={() => goToChild('')}>Continue</Button>
      </Flex>
    </>
  );
}

export const HAASEmailRegistration = () => {
  return (
    <>
      <Flex>
        <label htmlFor="email">
          Email Address
          <input id="email" type="email"></input>
        </label>

        <Button onClick={() => console.log('clicked')}>Continue</Button>
      </Flex>
    </>
  );
}

const renderNextNode = (nodeType: string) => {
  const Component: React.ReactNode | undefined = nodeMap.get(nodeType);

  return Component || <HAASText />
}

const HAASSlider = () => {
  const { register, watch, getValues } = useFormContext();
  const { goToChild } = useJSONTree();

  return (
    <Div flexGrow={0.5}>
      <ColumnFlex height="100%" justifyContent="space-between" width={1}>
        <H1 fontSize={-1} textAlign="center" color="white">{watch('slider-value', '5')}</H1>
        <Slider width={1} name="slider-value" onMouseUp={() => goToChild(getValues()['slider-value'] || null)} min={0} max={10} mt={4} defaultValue={5} ref={register} />
      </ColumnFlex>
    </Div>
  )
};

const nodeMap = new Map([
  ['slider', <HAASSlider />],
  ['multi-choice', <HAASMultiChoice />],
  ['social-share', <HAASSocialShare />],
  ['textbox', <HAASText />],
  ['registration', <HAASEmailRegistration />]
]);
