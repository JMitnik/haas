import * as UI from '@haas/ui';
import { MapPin, User } from 'react-feather';
import React from 'react';
import styled, { css } from 'styled-components';

import SliderNodeIcon from 'components/Icons/SliderNodeIcon';

interface TagProps {
  name: string;
  type: string;
}

const TagContainer = styled(UI.Flex)`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.app.mutedOnDefault};
    padding: 4px 10px;
    font-size: 0.8rem;
    color: ${theme.colors.app.onDefault};
    background: ${theme.colors.default.normal};
    border-radius: 8px;
    align-items: center;
    margin-right: 5px;

    svg {
      stroke: ${theme.colors.app.mutedAltOnDefault};
      width: 18px;
    }
  `}
`;

export const Tag = ({ tag }: { tag: TagProps }) => (
  <TagContainer data-cy="TagLabel">
    {tag.type === 'LOCATION' && (
      <MapPin />
    )}

    {tag.type === 'AGENT' && (
      <User />
    )}

    {tag.type === 'DEFAULT' && (
      <SliderNodeIcon color="black" />
    )}

    <UI.Div marginLeft="2px">{tag.name}</UI.Div>
  </TagContainer>
);
