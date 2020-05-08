import React from 'react';
import { Flex, H2 } from '@haas/ui';
import { Instagram, Facebook, Twitter, Linkedin } from 'react-feather';
import { ShareItem } from './SocialShareNodeStyles';
import { GenericNodeProps } from '../NodeLayout/NodeLayout';
import useDialogueFinish from 'hooks/use-dialogue-finish';

type SocialShareNodeProps = GenericNodeProps;

const SocialShareNode = ({ node }: SocialShareNodeProps) => {
  useDialogueFinish();

  return (
    <>
      <H2>{node.title}</H2>
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
    </>
  );
};

export default SocialShareNode;
