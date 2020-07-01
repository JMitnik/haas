import { Variants, motion } from 'framer-motion';
import React from 'react';

import { ButtonBody, ClientButton } from 'components/Buttons/Buttons';
import { Div, H5, Span } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { ReactComponent as SpeechIcon } from 'assets/icons/icon-chat.svg';
import { TreeNodeOptionProps } from 'models/Tree/TreeNodeOptionModel';

import { ChoiceIconContainer, MultiChoiceNodeContainer, MultiChoiceNodeGrid } from './MultiChoiceNodeStyles';
import { GenericNodeProps } from '../types';

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
      <NodeTitle>{node.title}</NodeTitle>

      <MultiChoiceNodeGrid
        variants={multiChoiceContainerAnimation}
        initial="initial"
        animate="animate"
      >
        {node.options?.map((multiChoiceOption: TreeNodeOptionProps, index: number) => (
          <motion.div key={index} variants={multiChoiceItemAnimation}>
            <Div key={index} flex={['100%', 1]}>
              <ClientButton
                brand="primary"
                type="button"
                onClick={() => onSubmit(multiChoiceOption)}
                key={index}
              >
                <ChoiceIconContainer>
                  <SpeechIcon />
                </ChoiceIconContainer>
                <ButtonBody>
                  <H5>
                    {(multiChoiceOption?.publicValue || multiChoiceOption?.value)}
                  </H5>
                </ButtonBody>
              </ClientButton>
            </Div>
          </motion.div>
        ))}

      </MultiChoiceNodeGrid>
    </MultiChoiceNodeContainer>
  );
};

export default MultiChoiceNode;
