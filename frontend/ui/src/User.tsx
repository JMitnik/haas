import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { ChevronDown } from 'react-feather';
import { Div } from './Generics';

export const DefaultProfilePicAvatar = styled(Div).attrs({ as: 'span' })`
  ${({ theme }) => css`
    border-radius: 100%;
    display: flex;
    background: ${theme.colors.primary};
    width: 60px;
    height: 60px;
    line-height: 60px;
    font-size: 1.5em;
    color: white;
    font-weight: 400;
    text-align: center;
    justify-content: center;
  `}
`;

export const ProfilePic = ({ userName }: { userName: string }) => {
  return (
    <Div useFlex alignItems="center">
      <DefaultProfilePicAvatar mr={1}>
        {userName.slice(0, 1)}
      </DefaultProfilePicAvatar>
    </Div>
  );
};

export default {};
