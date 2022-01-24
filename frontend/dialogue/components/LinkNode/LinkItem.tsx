import React from 'react'
import * as UI from '@haas/ui';
import { Facebook, Instagram, Linkedin, Twitter, Globe } from 'react-feather';

import WhatsappIcon from '../../assets/icons/icon-whatsapp.svg';
import * as LS from './LinkNodeStyles';
import { LinkItemType } from '../../types/helper-types'
import { LinkTypeEnumType } from '../../types/generated-types';

interface LinkItemProps {
  onClick: (link: LinkItemType, event: React.MouseEvent<HTMLAnchorElement>) => void;
  link: LinkItemType;
}

const MapLinkToIcon = (linkType: LinkTypeEnumType) => {
  switch(linkType) {
    case LinkTypeEnumType.Whatsapp: {
      return WhatsappIcon;
    }

    case LinkTypeEnumType.Facebook: {
      return Facebook;
    }

    case LinkTypeEnumType.Instagram: {
      return Instagram;
    }

    case LinkTypeEnumType.Linkedin: {
      return Linkedin;
    }

    case LinkTypeEnumType.Twitter: {
      return Twitter;
    }

    case LinkTypeEnumType.Api: {
      return Globe;
    }

    default: {
      return Facebook;
    }
  }
};

export const LinkItem = ({ link, onClick }: LinkItemProps) => {
  const Icon = MapLinkToIcon(link.type as LinkTypeEnumType);

  return (
    <LS.LinkItemContainer
      onClick={(event) =>  onClick(link, event)}
      brand={link.backgroundColor}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <UI.Span>
        <Icon />
      </UI.Span>
    </LS.LinkItemContainer>
  )
}
