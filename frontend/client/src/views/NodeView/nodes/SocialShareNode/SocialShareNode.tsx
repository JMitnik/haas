import { Facebook, Globe, Instagram, Linkedin, Share2, Twitter } from 'react-feather';
import React from 'react';

import { Flex, Span } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import CustomIcon from 'components/Icons/CustomIcon';
import useDialogueFinish from 'hooks/use-dialogue-finish';

import { GenericNodeProps } from '../types';
import { ItemContainer, ShareContainer, ShareItem, SocialShareNodeContainer } from './SocialShareNodeStyles';

type SocialShareNodeProps = GenericNodeProps;

const SocialShareNode = ({ node }: SocialShareNodeProps) => {
  useDialogueFinish();

  return (
    <SocialShareNodeContainer>
      <NodeTitle>{node.title}</NodeTitle>
      <ShareContainer>
        <Flex paddingBottom="15px" alignItems="center">
          <Share2 />
          <Span fontSize="1.2em">Share</Span>
        </Flex>

        <ItemContainer>
          {node.links.length === 0 && (
          <>
            <ShareItem href="https://twitter.com" target="__blank" rel="noopener noreferrer" bg="#1da1f2">
              <Twitter stroke="none" fill="white" />
            </ShareItem>

            <ShareItem href="https://facebook.com" target="__blank" rel="noopener noreferrer" bg="#1877f2">
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
            (link) => (
              <ShareItem
                href={link.url}
                target="__blank"
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
                {link.title && (
                <span>{link.title}</span>
                )}
              </ShareItem>
            ),
          )}

        </ItemContainer>
      </ShareContainer>

    </SocialShareNodeContainer>
  );
};

export default SocialShareNode;
