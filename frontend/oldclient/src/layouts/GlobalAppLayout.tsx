import { Div } from '@haas/ui';
import styled, { css } from 'styled-components';

const GlobalAppLayout = styled(Div)`
  ${({ theme }) => css`
    min-width: 100vw;
    min-height: calc(var(--vh, 1vh) * 100);
    background: ${theme.colors.primary};
    display: flex;
    align-items: stretch;

    font-family: 'Inter', sans-serif;
  `}
`;

export default GlobalAppLayout;
