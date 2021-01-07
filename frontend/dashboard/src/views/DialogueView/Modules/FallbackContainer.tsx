import { Div, Text } from '@haas/ui';
import styled, { css } from 'styled-components';

const FallbackContainer = styled(Div)`
    ${({ theme }) => css`
    position: relative;
    height: 100%;
    display: flex;
    align-items: flex-end;

    > ${Text} {
        padding: ${theme.gutter}px;
        position: relative;
        z-index: 300;
    }

    > ${Div} {
        position: absolute;
        bottom: 0;
        right: 0;
        transform: translateY(10%);
    }
`}
`;

export default FallbackContainer;
