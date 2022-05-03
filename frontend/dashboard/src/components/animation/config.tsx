import { Transition, Variant, Variants } from 'framer-motion';
import React from 'react';

interface MotionConfig {
  variants: {
    initial: Variant;
    animate: Variant;
    exit?: Variant;
  }
  transition?: Transition;
  style?: React.CSSProperties;
}

const makeMotionConfig = (config: MotionConfig) => ({
  ...config,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
});

/**
 * Motion that fades in by expanding the height of the component.
 *
 * Example usage:
 * <motion.div {...expandingHeightsMotion}>
 */
export const expandingHeightsMotion = makeMotionConfig({
  variants: {
    initial: { height: 0, width: 0, opacity: 0 },
    animate: { height: 'auto', width: 'auto', opacity: 1 },
    exit: { height: 0, width: 0, opacity: 0 },
  },
  transition: { ease: [0.04, 0.62, 0.23, 0.98], duration: 0.3 },
  style: { overflow: 'hidden' },
});

export const slideUpFadeMotion = makeMotionConfig({
  variants: {
    initial: { opacity: 0, y: '5px' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '5px' },
  },
  transition: { ease: [0.16, 1, 0.3, 1], duration: 0.4 },
});
