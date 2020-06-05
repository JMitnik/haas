import { Div } from '@haas/ui';
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components/macro';

export const MultiChoiceNodeContainer = styled(Div)``;

export const MultiChoiceNodeGrid = styled(motion.div)`
  ${({ theme }) => css`
    display: grid;
    grid-gap: ${theme.gutter}px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  `}
`;
