import styled, { css } from 'styled-components/macro';

import { Div } from '.';
import { Span } from './Span';
import { Text } from './Type';


export const List = styled(Div)``;

export const ListHeader = styled(Div)``;

export const ListGroup = styled(Div)``;
export const ListGroupHeader = styled(Text)`
`;

export const ListItem = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter / 2}px;
    display: flex;
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

export const ListItemCaret = styled(Div)``;