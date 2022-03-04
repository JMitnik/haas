import chroma from 'chroma-js';

export const lighten = (color: string, fraction: number): string => {
  return chroma(color).brighten(fraction).hex();
}

export const darken = (color: string, fraction: number): string => {
  return chroma(color).darken(fraction).hex();
}
