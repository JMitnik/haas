import { motion } from 'framer-motion';
import Color from 'color';

import { Button, Div, Flex } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

export const ShareNodeContainer = styled(Div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ShareButtonContainer = styled(Flex)`
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
        border-radius: 10px;
        padding: 18px 33px;
        background: ${Color(theme.colors.primary).lighten(0.75).hex()};
        color: ${Color(theme.colors.primary).darken(0.6).hex()};

        box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
        transform: scale(1);
        animation: pulse 2s infinite;

        span {
            font-size: 1.5em;
        }

        @keyframes pulse {
            0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
            }

            70% {
                transform: scale(1);
                box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
            }

            100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
            }
}

        svg {
            color: currentColor;
            margin-right: 10px;
        }
    `}
`;

export const SuccesMessageContainer = styled(motion.div)`
    position: absolute;
    bottom: -40px;
`;
