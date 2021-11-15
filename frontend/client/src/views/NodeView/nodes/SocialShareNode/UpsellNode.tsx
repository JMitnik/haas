import * as UI from '@haas/ui';
import { ShoppingCart } from 'react-feather';
import React from 'react';

import { LinkTypeEnumType } from 'types/generated-types';
import facebook from 'assets/images/logo-facebook.png';
import instagram from 'assets/images/logo-instagram.png';
import linkedin from 'assets/images/logo-linkedin.png';
import social from 'assets/images/logo-social.png';
import twitter from 'assets/images/logo-twitter.png';
import whatsapp from 'assets/images/logo-whatsapp.png';

import * as LS from './UpsellNodeStyles';

interface LinkProps {
  imageUrl: string | null
  header: string | null
  type: string | null
  subHeader: string | null
  url: string | null
  buttonText: string | null
  title: string | null
  backgroundColor: string | null
  iconUrl: string | null
}

interface UpsellNodeProps {
  link: LinkProps
}

const getHeaderImage = (link: LinkProps) => {
  if (link.imageUrl) {
    return link.imageUrl;
  }

  if (link.type === LinkTypeEnumType.Whatsapp) {
    return whatsapp;
  }

  if (link.type === LinkTypeEnumType.Instagram) {
    return instagram;
  }

  if (link.type === LinkTypeEnumType.Linkedin) {
    return linkedin;
  }

  if (link.type === LinkTypeEnumType.Facebook) {
    return facebook;
  }

  if (link.type === LinkTypeEnumType.Twitter) {
    return twitter;
  }

  if (link.type === LinkTypeEnumType.Social) {
    return social;
  }

  return '';
};

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
