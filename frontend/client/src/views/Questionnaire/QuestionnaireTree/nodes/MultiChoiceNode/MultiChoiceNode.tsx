import React, { useEffect, FC } from 'react';
import { H5, Flex, Button, Div, H2 } from '@haas/ui';
import useHAASTree from 'hooks/use-haas-tree';
import { useForm } from 'react-hook-form';
import { GenericNodeProps } from '../Node';
import { HAASFormEntry, MultiChoiceOption } from 'hooks/use-questionnaire';

type MultiChoiceNodeProps = GenericNodeProps;

const MultiChoiceNode = ({ node, isLeaf }: MultiChoiceNodeProps) => {
  const { treeDispatch } = useHAASTree();

  const { register, setValue, triggerValidation, getValues } = useForm<HAASFormEntry>({
    mode: 'onSubmit',
    defaultValues: {
      textValue: ''
    }
  });

  // Register the relevant form fields
  useEffect(() => {
    register('textValue');
  }, [register]);

  // Apply submission
  const onSubmit = async (multiChoiceOption: MultiChoiceOption) => {
    setValue('textValue', multiChoiceOption.value);
    const validForm = await triggerValidation('textValue');

    if (validForm) {
      const formEntry = getValues({ nest: true });
      treeDispatch.saveNodeEntry(formEntry);
      treeDispatch.goToChild(multiChoiceOption.value);
    }
  };

  return (
    <>
      <form>
        <Flex flexDirection="column" justifyContent="space-between">
          <H2>{node.title}</H2>
          {node.options?.map((multiChoiceOption: MultiChoiceOption, index: number) => (
            <Div
              key={index}
              fillChildren
              padding={[2, 4]}
              width={['100%', null]}
              flex={['100%', 1]}
            >
              <Button
                brand="primary"
                type="button"
                onClick={() => onSubmit(multiChoiceOption)}
                key={index}
              >
                <H5>
                  {(multiChoiceOption?.publicValue?.length ?? 0) > 0
                    ? multiChoiceOption?.publicValue
                    : multiChoiceOption?.value}
                </H5>
              </Button>
            </Div>
          ))}
        </Flex>
      </form>
    </>
  );
};

export default MultiChoiceNode;
