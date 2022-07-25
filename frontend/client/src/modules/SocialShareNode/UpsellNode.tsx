import * as UI from '@haas/ui';
import { ShoppingCart } from 'react-feather';
import React from 'react';

import { Link } from 'types/core-types';

import * as LS from './UpsellNodeStyles';
import { getHeaderImage } from './UpsellNode.helpers';

interface UpsellNodeProps {
  link: Link;
}

const ImageHeader = ({ link }: UpsellNodeProps) => (
  <LS.ImageContainer>
    <img src={getHeaderImage(link)} alt="product" />
  </LS.ImageContainer>
);

const UpsellNode = ({ link }: UpsellNodeProps) => (
  <UI.Flex justifyContent="center">
    <LS.DrawerContainer>

      <ImageHeader link={link} />

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
                <img alt="Icon on redirect button" src={link.iconUrl} />
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
