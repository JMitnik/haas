import * as UI from '@haas/ui';

import styled, { css } from 'styled-components';

export const BuilderContainer = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: 2fr 1fr;
    min-height: 100vh;
    grid-template-rows: 100%;
    margin: -${theme.gutter}px;
  `}
`;

export const BuilderCanvas = styled.div`
  ${({ theme }) => css`
    display: grid;
    height: 100%;
    width: 100%;
    justify-content: center;
    background: ${theme.colors.gray[100]};
    padding: ${theme.gutter}px;
  `}
`;

export const CampaignStepContainer = styled(UI.Grid)`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: 100px;
    grid-gap: ${theme.gutter}px;
    align-items: center;
  `}
`;

interface BuilderLabelProps {
  isActive?: boolean;
}

export const BuilderLabel = styled.span<BuilderLabelProps>`
  ${({ theme, isActive }) => css`
    padding: 4px 8px;
    font-weight: 700;
    line-height: 1rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: ${theme.colors.gray[200]};
    color: ${theme.colors.gray[500]};

    ${isActive && css`
      border-radius: 10px;
      background: ${theme.colors.blue[600]};
      color: white;
    `}
  `}
`;

export const BuilderEditPane = styled.div`
  ${({ theme }) => css`
    position: relative;
    height: 100%;
    width: 100%;
    background: white;
    padding: ${theme.gutter}px;
  `}
`;

export const BuilderEditPaneFooter = styled.div`
  ${({ theme }) => css`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: ${theme.gutter}px;
    height: 50px;
    border-top: 1px solid ${theme.colors.gray[100]};
  `}
`;