import styled, { css } from 'styled-components';

interface DialogueContainerProps {
  gradientStart: string;
  gradientTo: string;
  gradientStops: string[];
}

const DialogueContainer = css<DialogueContainerProps>`
  ${({ theme, gradientStart, gradientTo, gradientStops = [] }) => css`
      --bg-gradient-from: ${gradientStart};
      --bg-gradient-stops: ${gradientStops.join(', ')};
  `}
`;
