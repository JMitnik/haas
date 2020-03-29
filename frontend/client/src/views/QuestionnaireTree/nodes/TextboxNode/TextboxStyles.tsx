import { Button } from '@haas/ui';
import styled, { css } from 'styled-components/macro';
import { ActiveNodeContainer } from '../NodeStyles';

export const TextboxContainer = styled(ActiveNodeContainer)`
  ${({ theme }) => css`
    height: 100%;
  `}
`;
