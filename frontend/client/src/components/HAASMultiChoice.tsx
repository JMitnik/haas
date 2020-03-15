import React, { memo, useEffect } from 'react';
import { H5, Flex, Button, Div } from '@haas/ui';
import { useHAASTree, MultiChoiceOption, HAASFormEntry } from '../hooks/use-haas-tree';
import { useForm } from 'react-hook-form';

export const HAASMultiChoice = memo(() => {
  const { nodeHistoryStack, goToChild } = useHAASTree();
  const [ activeNode ] = nodeHistoryStack.slice(-1);

  const { register, setValue, triggerValidation, getValues } = useForm<HAASFormEntry>({
    mode: 'onSubmit',
    defaultValues: {
      data: {
        textValue: '',
      }
    }
  });

  // Register the relevant form fields
  useEffect(() => {
    register('data.textValue');
  }, [register]);

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
