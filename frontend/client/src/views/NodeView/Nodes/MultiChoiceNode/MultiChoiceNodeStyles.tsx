import { motion } from 'framer-motion';
import styled, { css } from 'styled-components/macro';

import { ActiveNodeContainer } from '../NodeLayout/NodeStyles';

export const MultiChoiceNodeContainer = styled(ActiveNodeContainer)`
  height: 100%;
`;

export const MultiChoiceNodeGrid = styled(motion.div)`
  ${({ theme }) => css`
    display: grid;
    grid-gap: ${theme.gutter}px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  `}
`;
