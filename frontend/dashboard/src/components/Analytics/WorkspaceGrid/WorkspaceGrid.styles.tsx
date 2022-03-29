import * as UI from '@haas/ui';
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';

export const WorkspaceGridContainer = styled(UI.Div)`
  ${({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.gray[200]};
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
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.075), 0 2px 8px rgba(0, 0, 0, 0.06);
  `}
`);
