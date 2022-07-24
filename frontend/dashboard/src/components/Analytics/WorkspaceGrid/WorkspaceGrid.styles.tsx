import * as UI from '@haas/ui';
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';

export const WorkspaceGridAdapterContainer = styled(UI.Div)``;

export const WidgetHeader = styled(UI.Div)`
  ${({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.gray[100]};
    padding: 24px;

    ${UI.H4} {
      font-size: 1.1rem;
      font-weight: 600;
      color: ${theme.colors.gray[600]};
      line-height: 1;
    }

    ${UI.Div} {
      font-size: 0.9rem;
      font-weight: 400;
      color: ${theme.colors.gray[500]};
    }
  `}
`;

export const BreadCrumbContainer = styled(UI.Div)`
  ${({ theme }) => css`
    position: absolute;
    left: ${theme.gutter / 2}px;
    top: 0;
  `}
`;

interface WorkspaceGridContainerProps {
  backgroundColor: string;
}

export const WorkspaceGridContainer = styled(UI.Div) <WorkspaceGridContainerProps>`
  ${({ theme, backgroundColor }) => css`
    background: ${backgroundColor};
    position: relative;
    height: 100%;
    min-height: 100vh;

    #items {
      opacity: 1;
      transition: all ${theme.transitions.normal};
    }

    #items:hover polygon {
      opacity: 0.4;
      cursor: pointer;
      transition: all ${theme.transitions.normal};
    }

    #items polygon:hover {
      opacity: 1;
      transition: all ${theme.transitions.normal};
    }
  `}
`;

export const GridControls = styled(UI.Div)`
  ${({ theme }) => css`
    position: absolute;
    top: 0;
    right: 0;
    padding: ${theme.gutter / 2}px;
  `}
`;

export const Button = styled(UI.Button)`
  ${({ theme }) => css`
    background-color: white !important;
    font-weight: 500 !important;
    color: ${theme.colors.gray[500]} !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.075), 0 2px 8px rgba(0, 0, 0, 0.06);
    border-radius: 10 !important;
  `}
`;

export const IconButton = styled(Button)`
  width: 40px !important;
  height: 40px !important;
  border-radius: 100% !important;
`;

export const DetailsPane = motion(styled(UI.Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter}px;
    background: white;
    border-radius: 5px;
  `}
`);

export const WorkspaceGridPaneContainer = styled(UI.Div)`
  ${({ theme }) => css`
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.075), 0 2px 8px rgba(0, 0, 0, 0.06);
    background: white;
    border-radius: 20px;

    > * {
      padding: 36px;
    }

    > *:first-child {
      border-radius: 12px 12px 0 0;
    }

    > *:last-child {
      border-radius: 0 0 12px 12px;
    }

    ${UI.H4} {
      font-size: 1.2rem;
      font-weight: 400;
      color: ${theme.colors.gray[700]};
      line-height: 1;
    }

    ${UI.H4} + ${UI.Span} {
      font-size: 0.9rem;
      font-weight: 400;
      color: ${theme.colors.gray[500]};
    }
  `}
`;

export const PaneHeader = styled(UI.Div)`
  ${({ theme }) => css`
    background: ${theme.colors.gray[50]};
    border-radius: 20px 20px 0 0;
    padding: ${theme.gutter / 2}px ${theme.gutter}px;
    border-bottom: ${theme.colors.gray[100]} 1px solid;

    ${UI.H4} {
      font-weight: 600;
      color: ${theme.colors.gray[600]};
    }

    ${UI.Helper} {
      color: ${theme.colors.gray[400]};
    }
  `}
`;

export const SwitchWrapper = styled(UI.Div)`
  ${({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -36px;
    transform: translateY(-50%);

    ${UI.Switch} {
      box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
      background: #fdfdfd;
      padding: 6px 24px;
      justify-content: center;
      border: 1px solid ${theme.colors.gray[50]};
    }

    ${UI.SwitchItem} {
      font-weight: 500;
      color: ${theme.colors.gray[400]};

      &.active {
        font-weight: 500;
        background: white;
        color: ${theme.colors.gray[600]};
        border: 1px solid ${theme.colors.gray[100]};
        padding: 6px 18px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.075), 0 2px 8px rgba(0, 0, 0, 0.06);
      }
    }
  `}
`;

export const WidgetCell = styled(UI.Div)`
  ${({ theme }) => css`
    ${UI.Span}:first-child {
      font-weight: 400;
      font-size: 0.9rem;
      color: ${theme.colors.gray[500]};
    }

    ${UI.Span}:nth-child(2) {
      font-size: 2rem;
      font-weight: 600;
      line-height: 1.5;
      display: block;
      margin-bottom: 0;
      color: ${theme.colors.gray[600]};
    }

    ${UI.Span}:last-child {
      font-weight: 400;
      font-size: 0.9rem;
      color: ${theme.colors.gray[400]};
    }
  `}
`;

export const MetadataLabel = styled(UI.Span)`
  ${({ theme }) => css`
    background: ${theme.colors.gray[200]};
    color: ${theme.colors.gray[700]};
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 500;
    border: 1px solid ${theme.colors.gray[200]};
  `}
`;

export const TooltipContainer = styled(UI.Div)`
  ${({ theme }) => css`
    min-width: 200px;
    background: ${theme.colors.white};
    border-radius: ${theme.borderRadiuses.md}px !important;

    ${UI.Icon} {
      svg {
        max-width: 100%;
        max-height: 100%;
      }
    }
  `}
`;

export const TooltipHeader = styled(UI.Div)`
  ${({ theme }) => css`
    padding: 12px 16px;
    background: ${theme.colors.neutral[200]};
    border-radius: ${theme.borderRadiuses.md}px ${theme.borderRadiuses.md}px 0 0;
    color: ${theme.colors.off[600]};
    font-weight: 600;
    border-bottom: 1px solid ${theme.colors.gray[200]};

    ${UI.Helper} {
      font-size: 0.7rem !important;
      color: ${theme.colors.off[300]};
    }
  `}
`;

export const TooltipBody = styled(UI.Div)`
  padding: 12px 16px;
  margin-bottom: 6px;
`;

export const Tooltip = motion(styled.div`
  ${({ theme }) => css`
    box-shadow: ${theme.boxShadows.md} !important;

    > * {
      padding: 0 !important;
      border-radius: 20px !important;
    }
  `}
`);

export const ControlBody = styled(UI.Span)`
  display: block;
  padding: 8px;
`;

export const ControlContainer = styled(UI.Span)`
  ${({ theme }) => css`
    display: block;
    background-color: ${theme.colors.white} !important;
    box-shadow: ${theme.boxShadows.md};
    border-radius: ${theme.borderRadiuses.md}px;
    color: ${theme.colors.main[500]} !important;
    transition: all ${theme.transitions.normal};

    &[aria-disabled='true'] {
      opacity: 0.5;
      background: ${theme.colors.off[200]} !important;
      box-shadow: ${theme.boxShadows.md} !important;
    }

    ${UI.Icon} svg {
      width: 21px !important;
    }
  `}
`;

export const ControlButton = styled(UI.Button)`
  ${({ theme }) => css`
    background-color: ${theme.colors.white} !important;
    box-shadow: ${theme.boxShadows.md};
    border-radius: ${theme.borderRadiuses.md}px;
    color: ${theme.colors.main[500]} !important;
    width: 30px;
    height: 30px;
    transition: all ${theme.transitions.normal};

    &[aria-disabled='true'] {
      opacity: 0.5;
      background: ${theme.colors.off[200]} !important;
      box-shadow: ${theme.boxShadows.md} !important;
    }

    &:hover {
      box-shadow: ${theme.boxShadows.lg};
      transition: all ${theme.transitions.normal};
    }

    ${UI.Icon} svg {
      width: 21px !important;
    }
  `}
`;
