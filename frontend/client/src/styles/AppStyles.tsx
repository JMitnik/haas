import styled, { css } from 'styled-components/macro';
import { Div } from '@haas/ui';

const AppContainer = styled(Div)`
  ${({ theme }) => css`
    min-width: 100vw;
    min-height: 100%;
    min-height: -webkit-fill-available;
    background: ${theme.colors.primary};
    display: flex;
    align-items: stretch;
  `}
`;

export default AppContainer;
