import React from 'react';
import { H1, H5, Slider, Flex, ColumnFlex, Button, Div } from '@haas/ui';
import { useFormContext } from 'react-hook-form';
import { useJSONTree, MultiChoiceOption } from '../hooks/use-json-tree';
import { Instagram } from 'react-feather';
import { useTransition, animated } from 'react-spring';

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
