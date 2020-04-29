import React from 'react';
import { motion } from 'framer-motion';
import { H2, H3, Div } from '@haas/ui';

const DialogueEnd = () => {
  const pageVariants = {
    initial: {
      y: '100%',
      opacity: 0
    },
    in: {
      y: 0,
      opacity: 1
    },
    out: {
      opacity: 0
    }
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

export default DialogueEnd;
