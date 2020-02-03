import React from 'react';
import { H1, H2, Slider, Flex, Button } from '@haas/ui';
import { useFormContext } from 'react-hook-form';
import { useJSONTree, HAASNode } from './hooks/use-json-tree';
import { Instagram } from 'react-feather';

export const HAASForm = () => {
  const { activeNode } = useJSONTree();

  return (
    <>
      <H1 color="white">{activeNode.title}</H1>
      {renderNextNode(activeNode)}
    </>
  );
};

export const HAASMultiChoice = () => {
  const { getValues } = useFormContext();
  const { activeNode } = useJSONTree();
  console.log(getValues());
  console.log(activeNode);

  return (
    <>
      <Flex>
        {activeNode.children.map((choice, index) => (
          <Button key={index}>
            {choice?.branchVal}
          </Button>
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

const renderNextNode = (node: HAASNode) => {
  if (node.type === "slider") {
    return <HAASSlider />
  }

  if (node.type === "multi-choice") {
    return <HAASMultiChoice />
  }

  if (node.type === 'social-share') {
    return <HAASSocialShare />
  }
}

const HAASSlider = () => {
  const { register, watch } = useFormContext();
  const { enterBranch } = useJSONTree();

  return (
    <>
      <H2 color="white">{watch('slider-value', '5')}</H2>
      <Slider name="slider-value" onMouseUp={() => enterBranch(watch('slider-value'))} min={0} max={10} mt={4} defaultValue={5} ref={register}/>
    </>
  )
};
