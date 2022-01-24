import chroma from 'chroma-js';

/**
 * Adds vibrant box-shadow css based on the given color (as well as a hover variant).
 */
export const makeColorfulBoxShadow = (color: string, isHover: boolean) => {
  if (isHover) {
    return `${chroma(color).alpha(0.8).hex()} 0px 10px 15px -3px, ${chroma(color).alpha(0.8).hex()} 0px 4px 6px -4px, ${chroma(color).alpha(0.8).hex()} 0px 10px 15px -3px, ${chroma(color).alpha(0.8).hex()} 0px 4px 6px -4px;`;
  } else {
    return `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, ${chroma(color).alpha(0.5).hex()} 0px 10px 15px -3px, ${chroma(color).alpha(0.5).hex()} 0px 4px 6px -4px;`;
  }
}
