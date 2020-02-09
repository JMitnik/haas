import React, { useState, useEffect } from 'react';
import { H1, H2, H5, Slider, Flex, ColumnFlex, Button, Div } from '@haas/ui';
import { useFormContext } from 'react-hook-form';
import { useJSONTree, HAASNode, MultiChoiceOption } from './hooks/use-json-tree';
import { Instagram } from 'react-feather';
import { useTransition, animated } from 'react-spring';

export const HAASForm = () => {
  const { activeNode } = useJSONTree();

  const transitions = useTransition(activeNode, (activeNode) => activeNode.id, {
    from: { opacity: 0, transform: 'scale(1.1)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' },
  });

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
          {renderNextNode(activeNode.type)}
        </animated.div>
      ))}
    </Div>
  );
};

export const HAASMultiChoice = () => {
  const { activeNode, enterBranch } = useJSONTree();

  return (
    <>
      <Flex flexWrap="wrap">
        {activeNode?.options?.map((multiChoiceOption: MultiChoiceOption, index: any) => (
          <Div fillChildren padding={4} flex={0.5}>
            <Button brand="primary" onClick={() => enterBranch(multiChoiceOption.value)} key={index}>
              <H5>
                {(multiChoiceOption?.publicValue?.length ?? 0) > 0 ? multiChoiceOption?.publicValue : multiChoiceOption?.value}
              </H5>
            </Button>
          </Div>
        ))}
      </Flex>
    </>
  )
}

export const HAASSocialShare = () => {
  return (
    <>
      <Instagram />
    </>
  )
}

export const HAASText = () => {
  const { enterBranch } = useJSONTree();
  return (
    <>
      <Flex>
        <input></input>
        <Button onClick={() => enterBranch('')}>Continue</Button>
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
  if (nodeType === "slider") {
    return <HAASSlider />
  }

  if (nodeType === "multi-choice") {
    return <HAASMultiChoice />
  }

  if (nodeType === 'social-share') {
    return <HAASSocialShare />
  }

  if (nodeType === 'textbox') {
    return <HAASText />
  }

  if (nodeType === 'registration') {
    return <HAASEmailRegistration/>
  }

  return <HAASText />
}

const HAASSlider = () => {
  const { register, watch } = useFormContext();
  const { enterBranch } = useJSONTree();

  return (
    <Div flexGrow={0.5}>
      <ColumnFlex height="100%" justifyContent="space-between" width={1}>
        <H1 fontSize={-1} textAlign="center" color="white">{watch('slider-value', '5')}</H1>
        <Slider width={1} name="slider-value" onTouchEnd={() => enterBranch(watch('slider-value'))} onMouseUp={() => enterBranch(watch('slider-value'))} min={0} max={10} mt={4} defaultValue={5} ref={register} />
      </ColumnFlex>
    </Div>
  )
};
