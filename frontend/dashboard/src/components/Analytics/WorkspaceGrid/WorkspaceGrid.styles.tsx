import * as UI from '@haas/ui';
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';

export const WorkspaceGridAdapterContainer = styled(UI.Div)`
  ${({ theme }) => css`
    background: white;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    /* padding: ${theme.gutter * 1.5}px; */
    border-radius: 8px;
    border: 1px solid #f7f6f6;
  `}
`;

export const WidgetHeader = styled(UI.Div)`
  ${({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.gray[100]};
    /* padding-bottom: ${theme.gutter / 2}px; */
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

export const WorkspaceGridContainer = styled(UI.Div)<WorkspaceGridContainerProps>`
  ${({ theme, backgroundColor }) => css`
    /* border-bottom: 1px solid ${theme.colors.gray[200]}; */
    background: ${backgroundColor};
    position: relative;
    svg polygon:hover {
      stroke: red;
      cursor: pointer;
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

export const DetailsPane = motion.custom(styled(UI.Div)`
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
    border-radius: 12px;

    > * {
      padding: 36px;
    }

    > *:first-child {
      border-radius: 12px 12px 0 0;
      padding-bottom: 54px;
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

type Brand = 'bad' | 'good' | 'neutral';

interface WidgetCellProps {
  brand: Brand;
}

export const WidgetCell = styled(UI.Div)<WidgetCellProps>`
  ${({ theme, brand }) => css`
    border-radius: 6px;
    /* border: 1px solid ${theme.colors.gray[100]}; */

    ${brand === 'bad' && css`
      color: #fc5985;
    `}

    ${brand === 'neutral' && css`
      color: #50507b;
    `}

    ${brand === 'good' && css`
      color: #17897b;
    `}

    ${UI.Span}:first-child {
      font-size: 2rem;
      font-weight: 600;
      display: block;
      margin-bottom: 0;
    }

    ${UI.Span}:last-child {
      font-size: 1rem;
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
    min-width: 300px;
    background: ${theme.colors.white};
    border-radius: 5px 20px 20px 20px !important;
  `}
`;

export const TooltipHeader = styled(UI.Div)`
  ${({ theme }) => css`
    padding: 12px 16px;
    background: ${theme.colors.gray[200]};
    border-radius: 5px 20px 0 0 !important;
    color: ${theme.colors.gray[600]};
    font-weight: 600;
    border-bottom: 1px solid ${theme.colors.gray[200]};

    ${UI.Helper} {
      font-size: 0.7rem !important;
      color: ${theme.colors.gray[400]};
    }
  `}
`;

export const TooltipBody = styled(UI.Div)`
  padding: 12px 16px;
  margin-bottom: 6px;
`;
