import styled, { css } from 'styled-components/macro';
import { Div } from '@haas/ui';

const AppContainer = styled(Div)`
  ${({ theme }) => css`
    min-width: 100vw;
    min-height: calc(var(--vh, 1vh) * 100);
    background: ${theme.colors.primary};
    display: flex;
    align-items: stretch;
  `}
`;

export default AppContainer;
