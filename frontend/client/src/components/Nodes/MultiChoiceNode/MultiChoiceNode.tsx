import { ClientButton } from 'components/Buttons/Buttons';
import { Div, H2, H5 } from '@haas/ui';
import { Variants, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';

import { HAASFormEntry } from 'types/generic';
import { TreeNodeOptionProps } from 'models/DialogueTree/TreeNodeOptionModel';
import useDialogueTree from 'providers/DialogueTreeProvider';
import useEdgeTransition from 'hooks/use-edge-transition';
import useProject from 'providers/ProjectProvider';

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
  const store = useDialogueTree();
  const { goToEdge } = useEdgeTransition();
  const { customer, dialogue } = useProject();

  const { register, setValue, triggerValidation } = useForm<HAASFormEntry>({
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
  const onSubmit = async (multiChoiceOption: TreeNodeOptionProps) => {
    setValue('textValue', multiChoiceOption.value);
    const validForm = await triggerValidation('textValue');

    if (validForm) {
      if (!customer || !dialogue) {
        throw new Error('We lost customer and/or dialogue');
      }

      store.session.add(node.id, {
        multiValues: null,
        numberValue: null,
        textValue: multiChoiceOption.value,
      });

      const nextEdgeId = node.getNextEdgeIdFromKey(multiChoiceOption.value);
      goToEdge(customer.slug, dialogue?.id, nextEdgeId);
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
        {node.options?.map((multiChoiceOption: TreeNodeOptionProps, index: number) => (
          <motion.div key={index} variants={multiChoiceItemAnimation}>
            <Div useFlex justifyContent="center" key={index} padding={2} flex={['100%', 1]}>
              <ClientButton
                brand="primary"
                type="button"
                onClick={() => onSubmit(multiChoiceOption)}
                key={index}
              >
                <H5>
                  {(multiChoiceOption?.publicValue || multiChoiceOption?.value)}
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
