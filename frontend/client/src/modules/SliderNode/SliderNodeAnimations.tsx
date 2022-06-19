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
