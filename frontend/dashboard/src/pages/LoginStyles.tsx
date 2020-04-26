import styled from 'styled-components/macro';
import { Div } from '@haas/ui';

export const LoginContainer = styled.div`
    min-height: 100vh;
    min-width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;

    > ${Div} {
        height: 100vh;
        width: 50%;
    }
`;
