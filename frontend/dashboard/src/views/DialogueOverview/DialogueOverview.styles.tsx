import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

export const TranslatedPlus = styled(UI.Div)`
  ${({ theme }) => css`
    transform: translate(25px, -10px);
    color: ${theme.colors.default.normalAlt};
  `};
`;
