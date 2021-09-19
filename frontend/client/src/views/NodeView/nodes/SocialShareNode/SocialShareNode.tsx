import { Facebook, Globe, Instagram, Linkedin, ShoppingCart, Twitter } from 'react-feather';
import React from 'react';
import styled, { } from 'styled-components';

import { Div, Flex } from '@haas/ui';
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

const DrawerContainer = styled(Div)`
  display: grid;
  row-gap: 2em;
  background: white;
  padding: 24px;
  border-radius: 30px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
  backdrop-filter: blur(10px);
`;

const TextGradient = styled(Div)`
  background-image: linear-gradient(180deg, rgba(6, 41, 166, 0.2) 0%, rgba(6, 41, 166, 0) 90.62%, rgba(6, 41, 166, 0.00574713) 96.87%),
linear-gradient(0deg, #22A8F4, #22A8F4);
    background-size: 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent; 
    -moz-text-fill-color: transparent;
`;

const HeaderContainer = styled(TextGradient)`
    font-size: 1.5em;
    font-weight: bold;
`;

const SubheaderContainer = styled(TextGradient)`
  font-size: 1em;
`;

const ImageContainer = styled(Div)`
  display: flex;
  justify-content: center;

  img {
    max-width: 70%;
  }
`;

const RedirectButton = styled.button`
  all: unset;

  display: flex;
  align-items: center;

  max-width: fit-content;
  background: #92E4FE;
  color: #1D9ED9;
  font-weight: bold;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  padding: 12px 32px;
  
`;

const RedirectContainer = styled(Div)`
  display: flex;
  justify-content: center;
  padding-bottom: 2em;
`;

const IconContainer = styled(Div)`
  margin-right: 10px;
  svg {
    /* width: 1em;
    height: auto; */
  }
`;

const SocialShareNode = ({ node }: SocialShareNodeProps) => {
  // TODO: Use the social capabilities of this event to enqueue
  const handleLinkClick = (event: any) => {
    console.log(event);
  };

  console.log('node links: ', node.links[0]);

  return (
    <SocialShareNodeContainer>
      <NodeTitle>{node.title}</NodeTitle>
      <DrawerContainer>
        <ImageContainer>
          <img src={node.links[0].imageUrl || ''} alt="product" />
        </ImageContainer>
        <div>
          <HeaderContainer>
            {node.links[0].header}
          </HeaderContainer>
          <SubheaderContainer>
            {node.links[0].subHeader}
          </SubheaderContainer>
        </div>
        <RedirectContainer>

          <RedirectButton>
            <IconContainer>
              <ShoppingCart />
            </IconContainer>
            Claim
          </RedirectButton>
        </RedirectContainer>

      </DrawerContainer>
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
