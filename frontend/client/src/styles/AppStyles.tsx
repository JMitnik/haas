import styled, { css } from 'styled-components/macro';
import { Div } from '@haas/ui';

const AppContainer = styled(Div)`
  ${({ theme }) => css`
    min-width: 100vw;
    height: 100vh;
    height: -webkit-fill-available;
    overflow: hidden;
    background: ${theme.colors.primary};
    display: flex;
    align-items: stretch;
  `}
`;

export default AppContainer;
