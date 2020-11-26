import React from 'react';
import Color from 'color';
import { ChevronRight } from 'react-feather';
import styled, { css } from 'styled-components/macro';

import { Div } from '.';
import { Span } from './Span';
import { Text } from './Type';


export const List = styled(Div)`
  ${({ theme }) => css`
    
  `}
`;

export const ListHeader = styled(Text)`
  ${({ theme }) => css`
  `}
`;

export const ListGroup = styled(Div)``;
export const ListGroupHeader = styled(Text)`
  ${({ theme }) => css`
    padding: ${theme.gutter / 2}px;
    color: ${theme.colors.gray[400]};
    font-weight: 800;
    font-size: 0.8rem;
  `}
`;

interface ListItemProps {
  isSelected?: boolean;
  accent?: string;
}

export const ListItem = styled(Div)<ListItemProps>`
  ${({ theme, isSelected, accent }) => css`
    padding: ${theme.gutter / 2}px;
    display: flex;
    border-left: 2px solid transparent;

    ${isSelected && css`
      border-left: 2px solid ${accent || theme.colors.primary};
      background: ${Color(accent).mix(Color('white'), 0.9).hex()};
    `}
  `}
`;
export const ListIcon = styled(Span)`
  ${({ theme }) => css`
    display: flex;
    width: 40px;
    height: 40px;
    margin-right: ${theme.gutter}px;
    border-radius: 5px;
    padding: 4px;
    color: white;
    justify-content: center;
    align-items: center;
  `}
`;

export const ListItemBody = styled(Div)`
  ${({ theme }) => css`
    margin-right: ${theme.gutter / 2}px;

    ${Text} {
      font-weight: 800;
    }

    ${Text} + ${Text} {
      color: ${theme.colors.gray[400]};
      font-weight: 400;
      font-size: 0.7rem;
    }
  `}
`;

const ListItemCaretWrapper = styled(Div)`
  ${({ theme }) => css`
    color: ${theme.colors.gray[400]};
    margin-left: auto;
    display: flex;
    align-items: center;
  `}
`;

export const ListItemCaret = () => (
  <ListItemCaretWrapper>
    <ChevronRight />
  </ListItemCaretWrapper>
);