import { Variants, motion } from 'framer-motion';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { ButtonBody, ClientButton } from 'components/Buttons/Buttons';
import { Div, H5 } from '@haas/ui';
import { GenericQuestionNodeProps } from 'modules/Node/Node.types';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { SessionActionType } from 'types/core-types';
import { ReactComponent as SpeechIcon } from 'assets/icons/icon-chat.svg';

import { MultiChoiceNodeContainer, MultiChoiceNodeGrid } from './MultiChoiceNodeStyles';
import { findChoiceChildEdge } from './ChoiceNode.helpers';

type MultiChoiceNodeProps = GenericQuestionNodeProps;

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

const MultiChoiceNode = ({ node, onRunAction }: MultiChoiceNodeProps) => {
  const handleSubmit = async (multiChoiceOption: any) => {
    const childEdge = findChoiceChildEdge(multiChoiceOption, node.children);
    const childNode = childEdge?.childNode?.id;

    onRunAction({
      startTimestamp: new Date(Date.now()),
      action: {
        type: SessionActionType.ChoiceAction,
        choice: {
          value: multiChoiceOption.value,
        },
      },
      reward: {
        overrideCallToActionId: multiChoiceOption.overrideLeaf?.id || node.overrideLeaf?.id,
        toEdge: childEdge?.id,
        toNode: childNode,
      },
    });
  };

  return (
    <MultiChoiceNodeContainer>
      <NodeTitle>{node.title}</NodeTitle>

      <MultiChoiceNodeGrid
        data-cy="Choices"
        variants={multiChoiceContainerAnimation}
        initial="initial"
        animate="animate"
      >
        {node.options?.map((multiChoiceOption: any, index: number) => (
          <motion.div key={index} variants={multiChoiceItemAnimation}>
            <Div key={index} flex={['100%', 1]}>
              <ClientButton
                data-cy="Option"
                type="button"
                onClick={() => handleSubmit(multiChoiceOption)}
                key={index}
                leftIcon={SpeechIcon}
              >
                <ButtonBody>
                  <H5>
                    <ReactMarkdown>
                      {(multiChoiceOption?.publicValue || multiChoiceOption?.value)}
                    </ReactMarkdown>
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
