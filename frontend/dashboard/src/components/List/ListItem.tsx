import { Div, Span } from '@haas/ui';
import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components/macro';

interface ListItemContainerProps {
  isNotClickable?: boolean;
  hasNoIcon?: boolean;
  isHeader?: boolean;
}

export const ListItemContainer = styled(Div)<ListItemContainerProps>`
  ${({ theme, isHeader = false }) => css`
    padding: 6px 16px;
    background: white;
    color: ${theme.colors.gray[600]};
    display: flex;
    align-items: center;
    font-weight: 500;
    
    ${isHeader && css`
      border-bottom: 1px solid ${theme.colors.gray[200]};
    `}

    svg {
      width: 0.9rem;
      height: 0.9rem;
    }

    &:hover {
      cursor: pointer;
      background: ${theme.colors.gray[100]};
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
    <Span pl={!renderLeftIcon ? '0.9rem' : 'auto'}>

      {children}
    </Span>
  </ListItemContainer>
);

export default ListItem;
