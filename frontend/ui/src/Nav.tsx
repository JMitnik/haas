import styled, { css } from 'styled-components/macro';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { GenericProps, Div } from './Generics';

const TopNavContainer = styled(Div)<GenericProps>`
  ${({ theme }) => css`
    box-shadow: 0px 5px 7px -2px rgba(0, 0, 0, 0.4);
    border-top: 5px solid ${theme.colors.primary};

    a {
      color: ${theme.colors.default.dark};
      text-decoration: none;
    }
  `}
`;


export const TopNav: FC = () => (
  <TopNavContainer>
    <Link to="/">
    </Link>
  </TopNavContainer>
);

export default {};
