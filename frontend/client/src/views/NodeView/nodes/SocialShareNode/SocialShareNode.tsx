import { Facebook, Globe, Instagram, Linkedin, Twitter } from 'react-feather';
import React, { useEffect } from 'react';

import { Flex } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import CustomIcon from 'components/Icons/CustomIcon';
import useDialogueFinish from 'hooks/useDialogueFinish';

import { GenericNodeProps } from '../types';
import { ShareItem, SocialShareNodeContainer } from './SocialShareNodeStyles';

type SocialShareNodeProps = GenericNodeProps;

const SocialShareNode = ({ node }: SocialShareNodeProps) => {
  const { createInteraction } = useDialogueFinish();

  useEffect(() => {
    createInteraction();
  }, []);

  return (
    <SocialShareNodeContainer>
      <NodeTitle>{node.title}</NodeTitle>
      <Flex justifyContent="center" alignItems="center">
        {node.links.length === 0 && (
          <>
            <ShareItem href="https://twitter.com" target="__blank" rel="noopener noreferrer" backgroundColor="#1da1f2">
              <Twitter stroke="none" fill="white" />
            </ShareItem>

            <ShareItem href="https://facebook.com" target="__blank" rel="noopener noreferrer" backgroundColor="#1877f2">
              <Facebook stroke="none" fill="white" />
            </ShareItem>

            <ShareItem href="https://instagram.com" target="__blank" rel="noopener noreferrer" bg="#c32aa3">
              <Instagram stroke="white" />
            </ShareItem>

            <ShareItem href="https://linkedin.com" target="__blank" rel="noopener noreferrer" bg="#007bb5">
              <Linkedin stroke="none" fill="white" />
            </ShareItem>
          </>
        ) }
        {node.links.map(
          (link, index) => (
            <ShareItem
              href={link.url}
              target="__blank"
              key={index}
              rel="noopener noreferrer"
              bg={link.backgroundColor || '#007bb5'}
            >
              {link.type === 'TWITTER' && <Twitter stroke="none" fill="white" />}
              {link.type === 'FACEBOOK' && <Facebook stroke="none" fill="white" />}
              {link.type === 'INSTAGRAM' && <Instagram stroke="white" />}
              {link.type === 'LINKEDIN' && <Linkedin stroke="none" fill="white" />}
              {(!['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN'].includes(link.type) && link.iconUrl)
              && <CustomIcon logo={link.iconUrl} />}
              {(!['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN'].includes(link.type) && !link.iconUrl)
              && <Globe stroke="white" />}
            </ShareItem>
          ),
        )}

      </Flex>
    </SocialShareNodeContainer>
  );
};

export default SocialShareNode;
