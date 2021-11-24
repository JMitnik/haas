import { useMemo } from 'react';
import styled, { css, useTheme } from 'styled-components';
import chroma from 'chroma-js';

import { Theme } from './theme';

interface DialogueThemerContainerProps {
  usesGradient: boolean;
  bgColor: string;
  bgAltColor: string;
}

const DialogueThemerContainer = styled.div<DialogueThemerContainerProps>`
  ${({ theme, usesGradient, bgColor, bgAltColor }) => css`
    height: 100%;
    --bgColor: ${bgColor};
    --bgAltColor: ${bgAltColor};
    --bg-gradient-start: ${bgColor};
    --bg-gradient-to: ${bgAltColor};
    --header-color: white;

    color: var(--header-color);

    ${usesGradient && css`
      background: linear-gradient(
        var(--bg-gradient-start),
        var(--bg-gradient-to)
      );
    `}

    ${!usesGradient && css`
      background: var(--bgColor);
    `}
  `};
`;

interface DialogueThemerProps {
  children: React.ReactNode;
}

/**
 * Calculate a harmonious background color
 * @param primaryColor
 */
const calculateBackgroundColor = (primaryColor: string) => {
  return chroma(primaryColor).luminance() > 0.5 ? chroma(primaryColor).darken(0.5).hex() : chroma(primaryColor).brighten(0.8).hex();
};

const calculateAltBackgroundColor = (bgColor: string) => {
  return chroma(bgColor).luminance() > 0.5 ? chroma(bgColor).darken(0.9).hex() : chroma(bgColor).brighten(0.8).hex();
};

/**
 * The DialogueThemer uses the available raw theme from the back-end to give an overall
 * style to the dialogue.
 *
 * Examples:
 * - The background is a linear gradient from the primary color to the secondary color.
 * - Sets future colorings
 * - Adapts fonts
 */
const DialogueThemer = ({ children }: DialogueThemerProps) => {
  const theme = useTheme();
  const usesGradient = true;

  // @ts-ignore
  const backgroundColor = useMemo(() => calculateBackgroundColor(theme.colors.primary), [theme]);
  // @ts-ignore
  const primaryAltColor = useMemo(() => calculateAltBackgroundColor(backgroundColor, theme), [backgroundColor, theme]);

  return (
    <DialogueThemerContainer
      usesGradient={usesGradient}
      bgColor={backgroundColor}
      bgAltColor={primaryAltColor}
    >
      {children}
    </DialogueThemerContainer>
  )
}

export default DialogueThemer;
