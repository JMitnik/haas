import styled, { css } from 'styled-components';

interface DialogueContainerProps {
  // gradientStart: string;
  // gradientTo: string;
  // gradientStops: string[];
}

export const DialogueContainer = styled.div<DialogueContainerProps>`
  ${({ theme }) => css`
    height: 100%;
    padding: ${theme.gutter}px 0;
    width: ${theme.containerWidth}px;
    margin: 0 auto;
  `}
`;
