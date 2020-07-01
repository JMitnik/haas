import { Variants } from 'framer-motion';

export const SlideMeAnimation: Variants = {
  animate: {
    opacity: [0, 1, 0],
    transition: {
      // easings: [0.42, 0, 0.58, 1],
      
      loop: Infinity,
      delay: 2,
      duration: 2,
      // delay: 2,
      // repeatDelay: 3,
    },
  },
};
