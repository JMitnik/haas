import { Label } from '@haas/ui';
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components/macro';

export const CustomerCardImage = styled.img`
  width: 75px;
  height: 75px;
  object-fit: contain;
`;

export const CustomerCardEnqueteLabel = styled(Label)`
  ${({ theme }) => css`
    text-transform: uppercase;
    color: ${theme.colors.default.muted};
    background: ${theme.colors.default.normal};
    font-size: 12px;

    font-weight: 1000;
    position: absolute;
    top: ${theme.gutter / 2}px;
    right: ${theme.gutter / 2}px;
  `}
`;
