import { Facebook, Globe, Instagram, Linkedin, Twitter } from 'react-feather';
import React from 'react';

import { Flex } from '@haas/ui';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { ReactComponent as Whatsapp } from 'assets/icons/icon-whatsapp.svg';
import CustomIcon from 'components/Icons/CustomIcon';

import { GenericNodeProps } from '../types';
import { ShareItem, SocialShareNodeContainer } from './SocialShareNodeStyles';

type SocialShareNodeProps = GenericNodeProps;

const DefaultSocialItems = (handleLinkClick: any) => (
  <>
    <ShareItem
      onClick={handleLinkClick}
      href="https://twitter.com"
      target="__blank"
      rel="noopener noreferrer"
      backgroundColor="#1da1f2"
    >
      <Twitter stroke="none" fill="white" />
    </ShareItem>

    <ShareItem
      onClick={handleLinkClick}
      href="https://facebook.com"
      target="__blank"
      rel="noopener noreferrer"
      backgroundColor="#1877f2"
    >
      <Facebook stroke="none" fill="white" />
    </ShareItem>

    <ShareItem
      onClick={handleLinkClick}
      href="https://instagram.com"
      target="__blank"
      rel="noopener noreferrer"
      bg="#c32aa3"
    >
      <Instagram stroke="white" />
    </ShareItem>

    <ShareItem
      onClick={handleLinkClick}
      href="https://linkedin.com"
      target="__blank"
      rel="noopener noreferrer"
      bg="#007bb5"
    >
      <Linkedin stroke="none" fill="white" />
    </ShareItem>
  </>
);

const SocialShareNode = ({ node, onQueueOnlyStore }: SocialShareNodeProps) => {
  // TODO: Use the social capabilities of this event to enqueue
  const handleLinkClick = (event: any) => {
    console.log(event);
  };

  return (
    <SocialShareNodeContainer>
      <NodeTitle>{node.title}</NodeTitle>
      <Flex data-testid="shareitems" justifyContent="center" alignItems="center">
        {node.links.length === 0 && <DefaultSocialItems />}
        {node.links.map((link, index) => (
          <ShareItem
            title={link.title || undefined}
            data-testid={link.type}
            href={link.url}
            onClick={handleLinkClick}
            target="__blank"
            key={index}
            rel="noopener noreferrer"
            backgroundColor={link.backgroundColor || '#007bb5'}
          >
            {link.type === 'TWITTER' && <Twitter stroke="none" fill="white" />}
            {link.type === 'FACEBOOK' && <Facebook stroke="none" fill="white" />}
            {link.type === 'INSTAGRAM' && <Instagram stroke="white" />}
            {link.type === 'LINKEDIN' && <Linkedin stroke="none" fill="white" />}
            {link.type === 'WHATSAPP' && <Whatsapp stroke="none" fill="white" />}
            {(!['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'WHATSAPP'].includes(link.type) && link.iconUrl)
              && <CustomIcon logo={link.iconUrl} />}
            {(!['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'WHATSAPP'].includes(link.type) && !link.iconUrl)
              && <Globe data-testid="globe" stroke="white" />}
          </ShareItem>
        ))}

      </Flex>
    </SocialShareNodeContainer>
  );
};

export default SocialShareNode;
