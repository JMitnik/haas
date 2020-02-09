import React from 'react';
import { H1, H2, Slider, Flex, ColumnFlex, Button, Div } from '@haas/ui';
import { useFormContext } from 'react-hook-form';
import { useJSONTree, HAASNode, MultiChoiceOption } from './hooks/use-json-tree';
import { Instagram } from 'react-feather';

export const HAASForm = () => {
  const { activeNode } = useJSONTree();

  return (
    <Div useFlex flexDirection='column' justifyContent='space-between' height='75vh'>
      <H1 textAlign="center" color="white">{activeNode.title}</H1>
      {renderNextNode(activeNode)}
    </Div>
  );
};

export const HAASMultiChoice = () => {
  const { activeNode, enterBranch } = useJSONTree();

  return (
    <>
      <Flex>
        {activeNode?.options?.map((multiChoiceOption: MultiChoiceOption, index: any) => (
          <Button margin={4} onClick={() => enterBranch(multiChoiceOption.value)} key={index}>
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

  if (node.type === 'textbox') {
    return <HAASText />
  }

  if (node.type === 'registration') {
    return <HAASEmailRegistration/>
  }
}

const HAASSlider = () => {
  const { register, watch } = useFormContext();
  const { enterBranch } = useJSONTree();

  return (
    <Div flexGrow={0.5}>
      <ColumnFlex height="100%" justifyContent="space-between" width={1}>
        <H1 fontSize={-1} textAlign="center" color="white">{watch('slider-value', '5')}</H1>
        <Slider width={1} name="slider-value" onMouseUp={() => enterBranch(watch('slider-value'))} min={0} max={10} mt={4} defaultValue={5} ref={register} />
      </ColumnFlex>
    </Div>
  )
};
