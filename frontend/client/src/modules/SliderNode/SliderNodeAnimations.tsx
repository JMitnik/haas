import { Variants } from 'framer-motion';

export const SlideMeAnimation: Variants = {
  animate: {
    opacity: [0, 0.5, 1, 0.5, 0],
    y: ['10px', '0px', '0px', '0px', '10px'],
    transition: {
      times: [0, 0.1, 0.3, 0.9, 1],
      loop: Infinity,
      delay: 1,
      repeatDelay: 3,
      duration: 2.8,
    },
  },
};

export const ExplainSlideLeftAnimation: Variants = {
  animate: {
    opacity: [0, 1, 0],
    x: ['0px', '-10px'],
    transition: {
      loop: Infinity,
      delay: 2,
      repeatDelay: 1.5,
      duration: 1.5,
    },
  },
};

export const ExplainSlideRightAnimation: Variants = {
  animate: {
    opacity: [0, 1, 0],
    x: ['0px', '10px'],
    transition: {
      loop: Infinity,
      delay: 2,
      repeatDelay: 1.5,
      duration: 1.5,
    },
  },
};

export const WiggleAnimation: Variants = {
  animate: {
    rotate: ['0deg', '5deg', '-5deg', '0deg', '5deg', '-5deg', '0deg'],
    transition: {
      loop: Infinity,
      repeatDelay: 2,
      duration: 0.5,
    },
  },
};
