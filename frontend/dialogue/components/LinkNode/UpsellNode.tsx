import * as UI from '@haas/ui';
import { ShoppingCart } from 'react-feather';
import React from 'react';

import { LinkType } from '../../types/generated-types';
import * as LS from './UpsellNodeStyles';

interface UpsellNodeProps {
  link: LinkType;
}

const UpsellNode = ({ link }: UpsellNodeProps) => (
  <UI.Flex justifyContent="center">
    <LS.DrawerContainer>

      <LS.ImageContainer>
        <img
          src={link.imageUrl || ''}
          alt="product"
        />
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

        <LS.RedirectButton
          overrideBackgroundColor={link.backgroundColor || undefined}
          title={link.title || undefined}
          href={link.url || undefined}
          target="__blank"
          rel="noopener noreferrer"
        >
          <UI.Div mr={2}>
            {link.iconUrl ? (
              <LS.ButtonIconContainer overrideBackgroundColor={link.backgroundColor || undefined}>
                <img
                  alt="Icon on redirect button"
                  src={link.iconUrl}
                />
              </LS.ButtonIconContainer>
            ) : <ShoppingCart />}

          </UI.Div>
          {link.buttonText || 'Go'}
        </LS.RedirectButton>
      </UI.Flex>

    </LS.DrawerContainer>
  </UI.Flex>
);

export default UpsellNode;
