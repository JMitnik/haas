import React from 'react';
import { H1, H2, Slider, Flex, Button } from '@haas/ui';
import { useFormContext } from 'react-hook-form';
import { useJSONTree, HAASNode, MultiChoiceOption } from './hooks/use-json-tree';
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
  const { activeNode, enterBranch } = useJSONTree();

  return (
    <>
      <Flex>
        {activeNode?.options?.map((multiChoiceOption: MultiChoiceOption, index: any) => (
          <Button onClick={() => enterBranch(multiChoiceOption.value)} key={index}>
          {(multiChoiceOption?.publicValue?.length ?? 0) > 0 ? multiChoiceOption?.publicValue : multiChoiceOption?.value}
        </Button>
        ))}
        
        {activeNode?.children?.map((choice, index) => (
          <Button onClick={() => enterBranch(choice.branchVal)} key={index}>
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

export const LeafNode = () => {
  // const { getLeafNode, setActiveNode} = useJSONTree();
  // // console.log(getLeafNode());
  // // setActiveNode(getLeafNode())
  return (
    <>
    </>
  );
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

  // return <LeafNode />
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
