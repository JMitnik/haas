import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { ChevronDown } from 'react-feather';
import { Div } from './Generics';

export const DefaultProfilePicAvatar = styled.span`
  ${({ theme }) => css`
    border-radius: 100%;
    background: ${theme.colors.default.normal};
    width: 50px;
    height: 50px;
  `}
`;

export const ProfilePic: FC = () => (
  <Div useFlex alignItems="center">
    <DefaultProfilePicAvatar />
    {' '}
    <ChevronDown />
  </Div>
);

export default {};
