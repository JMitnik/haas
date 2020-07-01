import { Variants } from 'framer-motion';

export const SlideMeAnimation: Variants = {
  animate: {
    opacity: [0, 1, 1, 0],
    transition: {
      times: [0, 0.3, 0.9, 1],
      loop: Infinity,
      delay: 1,
      repeatDelay: 2,
      duration: 4,
    },
  },
};
