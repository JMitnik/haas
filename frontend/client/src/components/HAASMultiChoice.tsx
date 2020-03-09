import React, { memo } from 'react';
import { H5, Flex, Button, Div } from '@haas/ui';
import { useJSONTree, MultiChoiceOption } from '../hooks/use-json-tree';

export const HAASMultiChoice = memo((props) => {
  const { historyStack, goToChild } = useJSONTree();
  let activeNode = historyStack.slice(-1)[0];

  return (
    <>
      <Flex flexWrap="wrap">
        {activeNode.options?.map((multiChoiceOption: MultiChoiceOption, index: any) => (
          <Div key={index} fillChildren padding={[2,4]} width={['100%', null]} flex={['100%', 1]}>
            {/* TODO: Register the form value here */}
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
});
