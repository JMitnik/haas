import React, { useEffect } from 'react';
import { H5, Div, H2, Grid } from '@haas/ui';
import useHAASTree from 'providers/dialogue-tree-provider';
import { useForm } from 'react-hook-form';
import { GenericNodeProps } from '../Node/Node';
import { HAASFormEntry, MultiChoiceOption } from 'types/generic';
import { MultiChoiceNodeContainer } from './MultiChoiceNodeStyles';
import { ClientButton } from 'components/Buttons/Buttons';

type MultiChoiceNodeProps = GenericNodeProps;

const MultiChoiceNode = ({ node }: MultiChoiceNodeProps) => {
  const {
    treeDispatch: { goToChild }
  } = useHAASTree();

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
      goToChild(node, multiChoiceOption.value, formEntry);
    }
  };

  return (
    <MultiChoiceNodeContainer>
      <H2>{node.title}</H2>
      <Grid gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))">
        {node.options?.map((multiChoiceOption: MultiChoiceOption, index: number) => (
          <Div useFlex justifyContent="center" key={index} padding={2} flex={['100%', 1]}>
            <ClientButton
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
            </ClientButton>
          </Div>
        ))}
      </Grid>
    </MultiChoiceNodeContainer>
  );
};

export default MultiChoiceNode;
