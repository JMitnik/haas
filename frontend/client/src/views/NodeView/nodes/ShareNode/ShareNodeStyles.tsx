import Color from 'color';

import { Button, Div, Flex } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

export const ShareNodeContainer = styled(Div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ShareButtonContainer = styled(Flex)`
    /* flex-direction: column; */
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const ShareButton = styled(Button)`
    ${({ theme }) => css`
        display: flex;
        justify-content: center;
        max-width: 200px;
        border: none;
        box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
        border-radius: 10px;
        padding: 12px 22px;
        background: ${Color(theme.colors.primary).lighten(0.75).hex()};
        color: ${Color(theme.colors.primary).darken(0.75).hex()};

        svg {
            color: currentColor;
            margin-right: 5px;
        }
    `}
`;
