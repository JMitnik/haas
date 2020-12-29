import { Div, Span } from '@haas/ui';
import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';

interface ListItemContainerProps {
  isNotClickable?: boolean;
  hasNoIcon?: boolean;
  isHeader?: boolean;
}

export const ListItemContainer = styled(Div)<ListItemContainerProps>`
  ${({ theme, isHeader = false }) => css`
    padding: 8px 20px;
    background: white;
    color: ${theme.colors.gray[400]};
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 0.9rem;
    
    ${isHeader && css`
      border-bottom: 1px solid ${theme.colors.gray[200]};
    `}

    svg {
      width: 0.9rem;
      height: 0.9rem;
    }

    &:hover {
      cursor: pointer;
      color: ${theme.colors.primaries[700]};
      transition: all cubic-bezier(0.6, -0.28, 0.735, 0.045) 0.2s;
    }
  `}
`;

interface ListItemProps {
  children: ReactNode;
  renderLeftIcon?: ReactNode;
  onClick?: any;
  isHeader?: boolean;
}

const ListItem = ({ children, renderLeftIcon, onClick, isHeader }: ListItemProps) => (
  <ListItemContainer hasNoIcon={!renderLeftIcon} isHeader={isHeader} onClick={onClick}>
    {renderLeftIcon}
    <Span pl={2}>
      {children}
    </Span>
  </ListItemContainer>
);

export default ListItem;
