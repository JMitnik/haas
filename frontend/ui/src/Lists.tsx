import React from 'react';
import Color from 'color';
import { ChevronRight } from 'react-feather';
import styled, { css } from 'styled-components';

import { Div, SelectContainer } from '.';

import { Span } from './Span';
import { Text } from './Type';


export const List = styled(Div)`
  ${({ theme }) => css`

  `}
`;

export const ListHeader = styled(Text)`
  ${({ theme }) => css`
    color: ${theme.colors.gray[600]};
    font-weight: 700;
    line-height: 1rem;
    padding: ${theme.gutter / 2}px;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid ${theme.colors.gray[200]};
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

type ListItemVariant = 'gray';

interface ListItemProps {
  isSelected?: boolean;
  accent?: string;
  hasNoSelect?: boolean;
  variant?: ListItemVariant;
}

export const ListItem = styled(Div) <ListItemProps>`
  ${({ theme, isSelected, accent, hasNoSelect, variant }) => css`
    padding: ${theme.gutter / 2}px;
    display: flex;
    transition: all .3s cubic-bezier(.55,0,.1,1);

    ${!hasNoSelect && css`
      border-left: 2px solid transparent;

      &:hover {
        border-left: 2px solid ${accent || theme.colors.primary};
        background: ${Color(accent).mix(Color('white'), 0.95).hex()};
        cursor: pointer;
        transition: all .3s cubic-bezier(.55,0,.1,1);
      }
    `}

    ${isSelected && css`
      border-left: 2px solid ${accent || theme.colors.primary};
      background: ${Color(accent).mix(Color('white'), 0.9).hex()};
    `}

    ${variant && variant === 'gray' && css`
      background: ${theme.colors.gray[50]};

      ${Text} {
        font-weight: 500;
        color: ${theme.colors.gray[600]};
        font-size: 0.8rem;
      }

      ${SelectContainer} {
        .select__control {
          border-color: ${theme.colors.gray[200]};
        }

        .select__menu {
          background: white;
        }
      }
    `}
  `}
`;
export const ListIcon = styled(Span)`
  ${({ theme }) => css`
    display: flex;
    width: 45px;
    height: 40px;
    margin-right: ${theme.gutter}px;
    border-radius: 10px;
    padding: 4px 10px;
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

