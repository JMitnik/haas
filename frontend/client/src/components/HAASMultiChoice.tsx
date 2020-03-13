import React, { memo, useEffect, useState } from 'react';
import { H5, Flex, Button, Div } from '@haas/ui';
import { useHAASTree, MultiChoiceOption, HAASEntry } from '../hooks/use-haas-tree';
import { useFormContext, useFieldArray, useForm } from 'react-hook-form';

export const HAASMultiChoice = memo((props) => {
  const { nodeHistoryStack, edgeHistoryStack, goToChild, currentDepth } = useHAASTree();
  const [ activeNode ] = nodeHistoryStack.slice(-1);
  const [ activeEdge ] = edgeHistoryStack.slice(-1);

  const { register, setValue, triggerValidation, getValues } = useForm<HAASEntry>({
    mode: 'onSubmit',
    defaultValues: {
      data: {
        textValue: '',
        edgeId: '',
        nodeId: ''
      }
    }
  });

  // Register the relevant form fields
  useEffect(() => {
    register('data.textValue');
    register('data.edgeId');
    register('data.nodeId');
  }, [register]);

  // Register the node once loaded
  useEffect(() => {
    if (activeNode?.id) {
      setValue('data.nodeId', activeNode.id);
    }
  }, [activeNode, setValue]);

  // Register the node once loaded
  useEffect(() => {
    if (activeEdge?.id) {
      setValue('data.edgeId', activeEdge.id);
    }
  }, [activeEdge, setValue]);

  // Apply submission
  const onSubmit = async (multiChoiceOption: MultiChoiceOption) => {
    setValue('data.textValue', multiChoiceOption.value);
    const validForm = await triggerValidation('data.textValue');

    if (validForm) {
      const formEntry = getValues({ nest: true });
      goToChild(multiChoiceOption.value, formEntry);
    }
  };

  return (
    <>
      <form>
        <Flex flexWrap="wrap">

          {activeNode.options?.map((multiChoiceOption: MultiChoiceOption, index: number) => (
            <Div key={index} fillChildren padding={[2,4]} width={['100%', null]} flex={['100%', 1]}>
              <Button brand="primary" type="button" onClick={() => onSubmit(multiChoiceOption)} key={index}>
                <H5>
                  {(multiChoiceOption?.publicValue?.length ?? 0) > 0 ? multiChoiceOption?.publicValue : multiChoiceOption?.value}
                </H5>
              </Button>
            </Div>
          ))}

        </Flex>
      </form>
    </>
  )
});
