import { Facebook, Globe, Instagram, Linkedin, Twitter } from 'react-feather';
import React, { useEffect } from 'react';

import { Flex } from '@haas/ui';
import { GenericQuestionNodeProps } from 'modules/Node/Node.types';
import { NodeTitle } from 'layouts/NodeLayout/NodeLayoutStyles';
import { ReactComponent as Whatsapp } from 'assets/icons/icon-whatsapp.svg';
import { useDialogueState } from 'modules/Dialogue/DialogueState';
import CustomIcon from 'components/Icons/CustomIcon';

import { ShareItem, SocialShareNodeContainer } from './SocialShareNodeStyles';
import UpsellNode from './UpsellNode';

type SocialShareNodeProps = GenericQuestionNodeProps;

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

export const SocialShareNode = ({ node }: SocialShareNodeProps) => {
  // TODO: Use the social capabilities of this event to enqueue
  const handleLinkClick = (event: any) => {
    console.log(event);
  };

  const finish = useDialogueState((state) => state.finish);

  useEffect(() => {
    finish(node.id);
  }, [finish, node.id]);

  return (
    <SocialShareNodeContainer>
      <NodeTitle>{node.title}</NodeTitle>
      {node.links.length === 1 && (
        <UpsellNode link={node.links[0]} />
      )}

      {(node.links.length === 0 || node.links.length > 1) && (
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
      )}

    </SocialShareNodeContainer>
  );
};

export default SocialShareNode;
