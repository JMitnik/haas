import * as UI from '@haas/ui';
import { ShoppingCart } from 'react-feather';
import React from 'react';

import * as LS from './UpsellNodeStyles';

interface UpsellNodeProps {
  link: {
    imageUrl: string | null
    header: string | null
    subHeader: string | null
    url: string | null
    buttonText: string | null
  }
}

const UpsellNode = ({ link }: UpsellNodeProps) => (
  <UI.Flex justifyContent="center">
    <LS.DrawerContainer>

      <LS.ImageContainer>
        <img src={link.imageUrl || ''} alt="product" />
      </LS.ImageContainer>

      <UI.Div pb={2}>
        <LS.HeaderContainer>
          {link.header}
        </LS.HeaderContainer>
        <LS.SubheaderContainer>
          {link.subHeader}
        </LS.SubheaderContainer>
      </UI.Div>
      <UI.Flex justifyContent="center" pb={2}>

        <LS.RedirectButton href={link.url || undefined} target="__blank" rel="noopener noreferrer">
          <UI.Div mr={2}>
            <ShoppingCart />
          </UI.Div>
          {link.buttonText || 'Go'}
        </LS.RedirectButton>
      </UI.Flex>

    </LS.DrawerContainer>
  </UI.Flex>
);

export default UpsellNode;
