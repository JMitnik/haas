import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

const AvatarContainer = styled(UI.Flex) <{ hasHover?: boolean }>`
  ${({ theme, hasHover }) => css`
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);

    ${hasHover && css`
      &:hover {
        color: ${theme.colors.white};
        background-color: ${theme.colors.main['500']} ;
      }
    `}
  `}
`;

export const Avatar = ({ name, brand, hasHover }: { name: string, brand: string, hasHover?: boolean }) => {
  const firstLetter = name.slice(0, 1);

  return (
    <AvatarContainer
      alignItems="center"
      justifyContent="center"
      bg={`${brand}.100`}
      width="30px"
      height="30px"
      color={`${brand}.600`}
      borderRadius="10px"
      hasHover={hasHover}
    >
      <UI.Span fontWeight="600">
        {firstLetter}
      </UI.Span>
    </AvatarContainer>
  );
};
