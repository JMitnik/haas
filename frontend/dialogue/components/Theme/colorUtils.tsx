import chroma from 'chroma-js';

import { Shades, ThemeBrightModeEnum } from '../../config/Theme/theme';

export const lighten = (color: string, fraction: number): string => {
  return chroma(color).brighten(fraction).hex();
}

export const darken = (color: string, fraction: number): string => {
  return chroma(color).darken(fraction).hex();
}

export const saturate = (color: string, fraction: number): string => {
  return chroma(color).saturate(fraction).hex();
}

export const getBrightMode = (color: string): ThemeBrightModeEnum => {
  const luminance = chroma(color).luminance();

  if (luminance > 0.5) {
    return ThemeBrightModeEnum.light;
  } else if (luminance < 0.5) {
    return ThemeBrightModeEnum.dark;
  } else {
    return ThemeBrightModeEnum.medium;
  }
}

export const generateColorShades = (color: string, brightMode: ThemeBrightModeEnum): Shades => {
  switch (brightMode) {
    case ThemeBrightModeEnum.light:
      // In the case of light, position the color at index 200
      return {
        100: lighten(color, 1),
        200: color,
        300: darken(color, 0.4),
        400: darken(color, 0.7),
        500: darken(color, 0.9),
        600: darken(color, 1.2),
        700: darken(color, 1.5),
        800: darken(color, 1.8),
        900: darken(color, 2.1),
      };
    case ThemeBrightModeEnum.medium:
      // In the case of medium, position the color at index 400
      return {
        100: lighten(color, 0.3),
        200: lighten(color, 0.2),
        300: lighten(color, 0.1),
        400: color,
        500: darken(color, 0.1),
        600: darken(color, 0.2),
        700: darken(color, 0.3),
        800: darken(color, 0.4),
        900: darken(color, 0.5),
      };

    case ThemeBrightModeEnum.dark:
      // In the case of dark, position the color at index 700
      return {
        100: lighten(color, 3.5),
        200: lighten(color, 2),
        300: lighten(color, 1.5),
        400: lighten(color, 1),
        500: lighten(color, 0.5),
        600: lighten(color, 0.2),
        700: color,
        800: darken(color, 1),
        900: darken(color, 1.5),
      };
    default:
      return {
        100: lighten(color, 0.3),
        200: lighten(color, 0.2),
        300: lighten(color, 0.1),
        400: color,
        500: darken(color, 0.1),
        600: darken(color, 0.2),
        700: darken(color, 0.3),
        800: darken(color, 0.4),
        900: darken(color, 0.5),
      }
  }
}
