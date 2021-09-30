import * as UI from '@haas/ui';
import { ShoppingCart } from 'react-feather';
import Color from 'color';
import React from 'react';
import styled, { css } from 'styled-components';

const DrawerContainer = styled(UI.Div)`
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

const TextGradient = styled(UI.Div)`
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

const ImageContainer = styled(UI.Div)`
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

const RedirectContainer = styled(UI.Div)`
  display: flex;
  justify-content: center;
  padding-bottom: 1em;
`;

const IconContainer = styled(UI.Div)`
  margin-right: 10px;
`;

interface UpsellNodeProps {
  link: {
    imageUrl: string | null
    header: string | null
    subHeader: string | null
    buttonText: string | null
    url: string | null
  };
}

const UpsellNode = ({ link }: UpsellNodeProps) => (
  <UI.Flex justifyContent="center">
    <DrawerContainer>

      <ImageContainer>
        <img src={link.imageUrl || ''} alt="product" />
      </ImageContainer>

      <div style={{ paddingBottom: '1em' }}>
        <HeaderContainer>
          {link.header}
        </HeaderContainer>
        <SubheaderContainer>
          {link.subHeader}
        </SubheaderContainer>
      </div>
      <RedirectContainer>

        <RedirectButton href={link.url} target="__blank" rel="noopener noreferrer">
          <IconContainer>
            <ShoppingCart />
          </IconContainer>
          {link.buttonText}
        </RedirectButton>
      </RedirectContainer>

    </DrawerContainer>
  </UI.Flex>
);

export default UpsellNode;
