import React from 'react'

import * as LS from './LinkNodeStyles';
import { LinkItemType } from '../../types/helper-types'

interface LinkItemProps {
  onClick: (link: LinkItemType, event: React.MouseEvent<HTMLAnchorElement>) => void;
  link: LinkItemType;
}

export const LinkItem = ({ link, onClick }: LinkItemProps) => {
  return (
    <LS.LinkItemContainer onClick={(event) =>  onClick(link, event)}>
      div
    </LS.LinkItemContainer>
  )
}
