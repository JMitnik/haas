import { Div } from '@haas/ui';
import Color from 'color';
import styled, { css } from 'styled-components';

export const PostLeafNodeContainer = styled(Div)`
  ${({ theme }) => css`
    justify-content: center;
    color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).mix(Color('white'), 0.9).saturate(1).hex() : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
  `}
`;
