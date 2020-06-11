import { Div, H2, H3 } from '@haas/ui';
import { motion } from 'framer-motion';
import React from 'react';

const DialogueEndView = () => {
  const pageVariants = {
    initial: {
      y: '100%',
      opacity: 0,
    },
    in: {
      y: 0,
      opacity: 1,
    },
    out: {
      opacity: 0,
    },
  };

  return (
    <div>
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants}>
        <Div color="white">
          <H2 textAlign="center" color="white">
            Thank you for participating!
          </H2>

          <H3 textAlign="center">We will get back to you</H3>
        </Div>
      </motion.div>
    </div>
  );
};

export default DialogueEndView;
