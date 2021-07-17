import * as UI from '@haas/ui';
import { Facebook, Globe, Instagram, Linkedin, Twitter } from 'react-feather';
import React from 'react';

import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { ReactComponent as Whatsapp } from 'assets/icons/icon-whatsapp.svg';
import CustomIcon from 'components/Icons/CustomIcon';

import * as LS from './SocialShareNodeStyles';
import { GenericNodeProps } from '../types';

type SocialShareNodeProps = GenericNodeProps;

const DefaultSocialItems = (handleLinkClick: any) => (
  <>
    <LS.ShareItem
      onClick={handleLinkClick}
      href="https://twitter.com"
      target="__blank"
      rel="noopener noreferrer"
      backgroundColor="#1da1f2"
    >
      <Twitter stroke="none" fill="white" />
    </LS.ShareItem>

    <LS.ShareItem
      onClick={handleLinkClick}
      href="https://facebook.com"
      target="__blank"
      rel="noopener noreferrer"
      backgroundColor="#1877f2"
    >
      <Facebook stroke="none" fill="white" />
    </LS.ShareItem>

    <LS.ShareItem
      onClick={handleLinkClick}
      href="https://instagram.com"
      target="__blank"
      rel="noopener noreferrer"
      bg="#c32aa3"
    >
      <Instagram stroke="white" />
    </LS.ShareItem>

    <LS.ShareItem
      onClick={handleLinkClick}
      href="https://linkedin.com"
      target="__blank"
      rel="noopener noreferrer"
      bg="#007bb5"
    >
      <Linkedin stroke="none" fill="white" />
    </LS.ShareItem>
  </>
);

const SocialIcon = ({ type, iconUrl }: { type: string, iconUrl: string }) => (
  <>
    {type === 'TWITTER' && <Twitter stroke="none" fill="white" />}
    {type === 'FACEBOOK' && <Facebook stroke="none" fill="white" />}
    {type === 'INSTAGRAM' && <Instagram stroke="white" />}
    {type === 'LINKEDIN' && <Linkedin stroke="none" fill="white" />}
    {type === 'WHATSAPP' && <Whatsapp stroke="none" fill="white" />}
    {(!['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'WHATSAPP'].includes(type) && iconUrl)
                  && <CustomIcon logo={iconUrl} />}
    {(!['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'WHATSAPP'].includes(type) && !iconUrl)
                  && <Globe data-testid="globe" stroke="white" />}
  </>
);

const SocialShareNode = ({ node }: SocialShareNodeProps) => {
  // TODO: Use the social capabilities of this event to enqueue
  const handleLinkClick = (event: any) => {
    console.log(event);
  };

  const linksWithTitle = node.links.filter((link) => !!link.title);
  const linksWithoutTitle = node.links.filter((link) => !link.title);

  return (
    <LS.SocialShareNodeContainer>
      <NodeTitle>{node.title}</NodeTitle>

      <LS.ShareDrawerContainer>
        {node.links.length === 0 && (
          <DefaultSocialItems />
        )}
        <LS.LinkRows>
          {linksWithTitle.map((link, index) => (
            <LS.LinkRowContainer key={index}>
              <UI.Span>
                {link.title}
              </UI.Span>
              <UI.Span>
                <LS.ShareItem
                  title={link.title || undefined}
                  data-testid={link.type}
                  href={link.url}
                  onClick={handleLinkClick}
                  target="__blank"
                  key={index}
                  rel="noopener noreferrer"
                  backgroundColor={link.backgroundColor || '#007bb5'}
                >
                  <SocialIcon type={link.type} iconUrl={link.iconUrl || ''} />
                </LS.ShareItem>
              </UI.Span>
            </LS.LinkRowContainer>
          ))}
        </LS.LinkRows>
        <UI.Flex justifyContent="space-between">

          {linksWithoutTitle.map((link, index) => (
            <LS.LinkContainer key={index}>
              <LS.ShareItem
                title={link.title || undefined}
                data-testid={link.type}
                href={link.url}
                onClick={handleLinkClick}
                target="__blank"
                key={index}
                rel="noopener noreferrer"
                backgroundColor={link.backgroundColor || '#007bb5'}
              >
                <SocialIcon type={link.type} iconUrl={link.iconUrl || ''} />
              </LS.ShareItem>
            </LS.LinkContainer>
          ))}
        </UI.Flex>

      </LS.ShareDrawerContainer>
    </LS.SocialShareNodeContainer>
  );
};

export default SocialShareNode;
