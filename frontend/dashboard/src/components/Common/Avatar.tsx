import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';

const AvatarContainer = styled(UI.Flex)`
  ${({ theme }) => css`
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);

    &:hover {
      color: ${theme.colors.white};
      background-color: ${theme.colors.main['500']} ;
    }
  `}
  
`;

export const Avatar = ({ name, brand }: { name: string, brand: string }) => {
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
    >
      <UI.Span fontWeight="600">
        {firstLetter}
      </UI.Span>
    </AvatarContainer>
  );
};
