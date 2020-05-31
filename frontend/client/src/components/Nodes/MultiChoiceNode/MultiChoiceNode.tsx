import { ClientButton } from 'components/Buttons/Buttons';
import { Div, Grid, H2, H5 } from '@haas/ui';
import { Variants, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';

import { HAASFormEntry, MultiChoiceOption } from 'types/generic';
import useDialogueTree from 'providers/DialogueTreeProvider';

import { GenericNodeProps } from '../NodeLayout/NodeLayout';
import { MultiChoiceNodeContainer, MultiChoiceNodeGrid } from './MultiChoiceNodeStyles';

type MultiChoiceNodeProps = GenericNodeProps;

const multiChoiceContainerAnimation: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const multiChoiceItemAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const MultiChoiceNode = ({ node }: MultiChoiceNodeProps) => {
  // const {
  //   treeDispatch: { goToChild, saveEntry },
  // } = useDialogueTree();

  const goToChild = (a: any, b: any, c: any) => {};
  const saveEntry = (a: any, b: any, c: any) => {};

  console.log('We are rendering multichoice node');

  const { register, setValue, triggerValidation, getValues } = useForm<HAASFormEntry>({
    mode: 'onSubmit',
    defaultValues: {
      textValue: '',
    },
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
      saveEntry(node, multiChoiceOption.value, formEntry);
      goToChild(node, multiChoiceOption.value, null);
    }
  };

  return (
    <MultiChoiceNodeContainer>
      <H2>{node.title}</H2>

      <MultiChoiceNodeGrid
        variants={multiChoiceContainerAnimation}
        initial="initial"
        animate="animate"
      >
        {node.options?.map((multiChoiceOption: MultiChoiceOption, index: number) => (
          <motion.div key={index} variants={multiChoiceItemAnimation}>
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
          </motion.div>
        ))}

      </MultiChoiceNodeGrid>
    </MultiChoiceNodeContainer>
  );
};

export default MultiChoiceNode;
