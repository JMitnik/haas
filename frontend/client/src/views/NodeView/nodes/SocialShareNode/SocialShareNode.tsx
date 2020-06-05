import { Facebook, Instagram, Linkedin, Twitter } from 'react-feather';
import React from 'react';

import { Flex } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import useDialogueFinish from 'hooks/use-dialogue-finish';

import { GenericNodeProps } from '../types';
import { ShareItem, SocialShareNodeContainer } from './SocialShareNodeStyles';

type SocialShareNodeProps = GenericNodeProps;

const SocialShareNode = ({ node }: SocialShareNodeProps) => {
  useDialogueFinish();

  return (
    <SocialShareNodeContainer>
      <NodeTitle>{node.title}</NodeTitle>
      <Flex justifyContent="center" alignItems="center">
        <ShareItem backgroundColor="#1da1f2">
          <Twitter stroke="none" fill="white" />
        </ShareItem>

        <ShareItem backgroundColor="#1877f2">
          <Facebook stroke="none" fill="white" />
        </ShareItem>

        <ShareItem bg="#c32aa3">
          <Instagram stroke="white" />
        </ShareItem>

        <ShareItem bg="#007bb5">
          <Linkedin stroke="none" fill="white" />
        </ShareItem>
      </Flex>
    </SocialShareNodeContainer>
  );
};

export default SocialShareNode;
