import chroma from 'chroma-js';
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';

import { makeColorfulBoxShadow } from '../../utils/makeColorfulBoxShadow';


const makeLinearBackground = (color: string) => {
  if (chroma(color).luminance() > 0.5) {
    return `linear-gradient(160grad, ${chroma(color).darken(0.5).hex()} 0%, hsla(222.9, 70.3%, 41%, 0.56))`;
  } else {
    return `linear-gradient(160grad, ${chroma(color).brighten(0.5).hex()} 0%, hsla(222.9, 70.3%, 41%, 0.56))`;
  }
}

const color = '#4f66ff';

export const ShareNodeButton = motion(styled.button`
  width: 250px;
  height: 250px;
  background: ${makeLinearBackground('#4f66ff')};
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  /* box-shadow: ${makeColorfulBoxShadow('#4f66ff', false)}; */
  border-radius: 100%;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    /* box-shadow: ${makeColorfulBoxShadow('#4f66ff', true)}; */
  }
`);
