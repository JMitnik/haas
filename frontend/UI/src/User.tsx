import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { ChevronDown } from 'react-feather';
import { Div } from './Generics';

export const DefaultProfilePicAvatar = styled(Div).attrs({ as: 'span' })`
  ${({ theme }) => css`
    border-radius: 100%;
    display: inline-block;
    background: ${theme.colors.default.normal};
    width: 50px;
    height: 50px;
  `}
`;

export const ProfilePic: FC = () => (
  <Div useFlex alignItems="center">
    <DefaultProfilePicAvatar mr={1} />
    <ChevronDown />
  </Div>
);

export default {};
