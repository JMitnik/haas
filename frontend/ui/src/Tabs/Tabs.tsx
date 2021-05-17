import React from 'react';
import { Plus } from 'react-feather';
import styled, { css } from 'styled-components';

import { Button } from '../Buttons';
import { Span } from '../Span';


export const Tabs = styled.div`
  ${({ theme }) => css`
    display: flex;
    text-decoration: none;
    width: 100%;
    border-bottom: 1px solid ${theme.colors.app.mutedOnDefault};
  `}
`;

interface TabProps {
  isActive?: boolean;
}

export const Tab = styled(Span)<TabProps>`
  ${({ theme, isActive = false }) => css`
    padding: 8px 12px;
    text-decoration: none;
    color: ${theme.colors.app.mutedAltOnDefault};

    ${isActive && css`
      color: ${theme.colors.blue[500]};
      border-bottom: 2px solid ${theme.colors.blue[500]};
    `}
    }
  `}
`;

export const AddTabButton = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => {
  return (
    <AddTabButtonContainer>
      <Button leftIcon={Plus} variant="outline" size="sm" onClick={onClick}>
        {children}
      </Button>
    </AddTabButtonContainer>
  )
}

export const AddTabButtonContainer = styled.div`
  ${({ theme }) => css`
    padding: 8px 12px;

  `}
`;