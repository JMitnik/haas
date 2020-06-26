import { Flex } from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components/macro';

export const AvatarContainer = styled.div`
  ${({ theme }) => css`
    border-radius: 100%;
    display: flex;
    background: ${theme.colors.primary};
    width: 40px;
    height: 40px;
    line-height: 40px;
    font-size: 1.5em;
    color: white;
    font-weight: 400;
    text-align: center;
    justify-content: center;
  `}
`;

const Avatar = ({ name }: { name: string }) => (
  <Flex alignItems="center">
    <AvatarContainer>
      {name.slice(0, 1)}
    </AvatarContainer>
  </Flex>
);

export default Avatar;
