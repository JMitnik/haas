import { Variants, motion } from 'framer-motion';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { ButtonBody, ClientButton } from 'components/Buttons/Buttons';
import { Div, H5 } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { SessionEntryDataProps } from 'models/Session/SessionEntryModel';
import { ReactComponent as SpeechIcon } from 'assets/icons/icon-chat.svg';
import { TreeNodeOptionProps } from 'models/Tree/TreeNodeOptionModel';

import { GenericNodeProps } from '../types';
import { MultiChoiceNodeGrid, VideoEmbeddedNodeContainer } from './VideoEmbeddedNodeStyles';
import YoutubeEmbed from './YoutubeEmbed';

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

const VideoEmbeddedNode = ({ node, onEntryStore }: MultiChoiceNodeProps) => {
  const handleSubmit = async (multiChoiceOption: TreeNodeOptionProps) => {
    const entry: SessionEntryDataProps = {
      choice: undefined,
      video: { value: multiChoiceOption.value },
      register: undefined,
      slider: undefined,
      textbox: undefined,
    };

    onEntryStore(entry, multiChoiceOption.value, multiChoiceOption.overrideLeaf);
  };

  return (
    <VideoEmbeddedNodeContainer>
      <Div width="100%">
        <NodeTitle>{node.title}</NodeTitle>
      </Div>

      <Div width="100%">
        <YoutubeEmbed videoId={node.extraContent} />
      </Div>

      <Div width="100%">
        <MultiChoiceNodeGrid
          data-cy="Choices"
          variants={multiChoiceContainerAnimation}
          initial="initial"
          animate="animate"
        >
          {node.options?.map((multiChoiceOption: TreeNodeOptionProps, index: number) => (
            <motion.div key={index} variants={multiChoiceItemAnimation}>
              <Div key={index} flex={['100%', 1]}>
                <ClientButton
                  data-cy="Option"
                  type="button"
                  onClick={() => handleSubmit(multiChoiceOption)}
                  key={index}
                  leftIcon={<SpeechIcon />}
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
      </Div>

    </VideoEmbeddedNodeContainer>
  );
};

export default VideoEmbeddedNode;
