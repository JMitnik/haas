import { Variants, motion } from 'framer-motion';
import React from 'react';

import { ClientButton } from 'components/Buttons/Buttons';
import { Div, H2, H5 } from '@haas/ui';
import { TreeNodeOptionProps } from 'models/Tree/TreeNodeOptionModel';

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

const MultiChoiceNode = ({ node, onEntryStore }: MultiChoiceNodeProps) => {
  const onSubmit = async (multiChoiceOption: TreeNodeOptionProps) => {
    const entry: any = {
      multiValues: null,
      numberValue: null,
      textValue: multiChoiceOption.value,
    };

    onEntryStore(entry, multiChoiceOption.value);
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
