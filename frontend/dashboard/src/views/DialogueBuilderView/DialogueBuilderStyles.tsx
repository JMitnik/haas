/* eslint-disable import/prefer-default-export */
import styled, { css } from 'styled-components/macro';

export const DialogueBuilderContainer = styled.div`
  ${({ theme }) => css`
    padding: ${theme.gutter * 2}px 0;
  `}
`;
