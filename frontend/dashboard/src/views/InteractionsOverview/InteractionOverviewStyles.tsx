import { Div, Card } from '@haas/ui';
import styled, { css } from 'styled-components';


const FlexRow = styled(Div)`
    display: flex;
    flex-direction: row;
`;

export const InputOutputContainer = styled(FlexRow)`
    justify-content: space-between;
`;

export const InputContainer = styled(FlexRow)`
    /* margin-right: 2.5%; */
    align-items: center;
`

export const OutputContainer = styled(FlexRow)`
    align-items: center;
`;

export const InteractionsOverviewContainer = styled(Div)`
${({ theme }) => css`
    margin-left: ${theme.gutter}
`};
    
    width: '100%';
    height: '100%';
    border: '1px solid black'
`;
