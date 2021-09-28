import { Facebook, Globe, Instagram, Linkedin, ShoppingCart, Twitter } from 'react-feather';
import Color from 'color';
import React from 'react';
import styled, { css } from 'styled-components';

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
   ${({ theme }) => css`
  display: grid;
  row-gap: 2em;
  background: ${Color(theme.colors.primary).mix(Color('white'), 0.9).saturate(1).hex()};
  
  padding: 24px;
  border-radius: 30px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
  backdrop-filter: blur(10px);
  max-width: 600px;
  `}
`;

const TextGradient = styled(Div)`
 ${({ theme }) => css`
    color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).hex() : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
 `}
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
    max-height: 200px;
    object-fit: contain;
  }
`;

const RedirectButton = styled.a`
   ${({ theme }) => css`
    display: flex;
    align-items: center;
  
    max-width: fit-content;
    font-weight: bold;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    padding: 12px 32px;

    animation: 2s pulse infinite;
    text-decoration: none;

    background: linear-gradient(45deg, ${Color(theme.colors.primary).lighten(0.3).hex()}, ${Color(theme.colors.primary).lighten(0.3).saturate(1).hex()}); 
    font-family: 'Inter', sans-serif;
    color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).mix(Color('white'), 0.8).saturate(1).hex() : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};

    :hover {
      cursor: pointer;
      color: ${Color(theme.colors.primary).isDark() ? Color('white').hex() : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
    }
  `}
  
  @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(0, 0 ,0, 0.7);
      }
      
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 5px rgba(0, 0 ,0, 0);
      }

      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0px rgba(0, 0, 0, 0);
      }
    }
`;

const RedirectContainer = styled(Div)`
  display: flex;
  justify-content: center;
  padding-bottom: 1em;
`;

const IconContainer = styled(Div)`
  margin-right: 10px;
`;

const SocialShareNode = ({ node }: SocialShareNodeProps) => {
  // TODO: Use the social capabilities of this event to enqueue
  const handleLinkClick = (event: any) => {
    console.log(event);
  };

  return (
    <SocialShareNodeContainer>
      <NodeTitle>{node.title}</NodeTitle>
      {node.links.length === 1 && (
        <Flex justifyContent="center">
          <DrawerContainer>

            <ImageContainer>
              <img src={node.links[0].imageUrl || ''} alt="product" />
            </ImageContainer>

            <div style={{ paddingBottom: '1em' }}>
              <HeaderContainer>
                {node.links[0].header}
              </HeaderContainer>
              <SubheaderContainer>
                {node.links[0].subHeader}
              </SubheaderContainer>
            </div>
            <RedirectContainer>

              <RedirectButton href={node.links[0].url} target="__blank" rel="noopener noreferrer">
                <IconContainer>
                  <ShoppingCart />
                </IconContainer>
                {node.links[0].buttonText}
              </RedirectButton>
            </RedirectContainer>

          </DrawerContainer>
        </Flex>
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
