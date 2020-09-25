import { Variants } from 'framer-motion';

export const SlideMeAnimation: Variants = {
  animate: {
    opacity: [0, 1, 1, 1, 0],
    transition: {
      times: [0, 0.1, 0.3, 0.9, 1],
      loop: Infinity,
      delay: 0.8,
      repeatDelay: 2.8,
      duration: 1.6,
    },
  },
};
