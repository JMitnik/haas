import { Div } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

const GlobalAppLayout = styled(Div)`
  ${({ theme }) => css`
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    min-width: 100vw;
    min-height: calc(var(--vh, 1vh) * 100);
    background: ${theme.colors.primary};
    display: flex;
    align-items: stretch;
  `}
`;

export default GlobalAppLayout;
