import { Div } from '@haas/ui';
import styled, { css } from 'styled-components';

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

export const PopoverItem = styled.button` 
  all: unset;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
`;
