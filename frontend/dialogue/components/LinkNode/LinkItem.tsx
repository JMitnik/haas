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
      return () => <WhatsappIcon fill="currentColor" stroke="white" />;
    }

    case LinkTypeEnumType.Facebook: {
      return () => <Facebook fill="currentColor" stroke="none" />;
    }

    case LinkTypeEnumType.Instagram: {
      return () => <Instagram fill="none" stroke="currentColor" />;
    }

    case LinkTypeEnumType.Linkedin: {
      return () => <Linkedin fill="white" stroke="none"/>;
    }

    case LinkTypeEnumType.Twitter: {
      return () => <Twitter fill="currentColor" stroke="none" />;
    }

    case LinkTypeEnumType.Api: {
      return () => <Globe fill="none" stroke="currentColor" />;
    }

    default: {
      return () => <Facebook fill="none" stroke="currentColor" />;
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
