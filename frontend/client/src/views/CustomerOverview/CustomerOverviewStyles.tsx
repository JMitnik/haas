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

export const CustomerOverviewContainer = styled(motion.div)`
  ${({ theme }) => css`
    max-width: 100%;
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 48px;
    padding-top: 100px;
    padding-bottom: 100px;

    @media ${theme.media.mob} {
      padding-top: 30px;
      padding-bottom: 30px;
      padding-left: 24px;
      padding-right: 24px;
    }
  `}
`;
