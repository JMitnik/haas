import { Div } from '@haas/ui';
import styled from 'styled-components';

const FlexRow = styled(Div)`
    display: flex;
    flex-direction: row;
`;

export const InputOutputContainer = styled(FlexRow)`
    justify-content: space-between;
`;

export const InputContainer = styled(FlexRow)`
    align-items: center;
`;

export const OutputContainer = styled(FlexRow)`
    align-items: center;
`;

