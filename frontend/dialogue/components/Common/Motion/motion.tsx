import React from 'react';
import { motion, MotionStyle, Variants } from 'framer-motion';

export { AnimatePresence } from 'framer-motion';

interface CommonMotionProps {
  children?: React.ReactNode;
  style?: MotionStyle;
}

/**
 * Fade in and out using only opacity.
 * @param param0
 * @returns
 */
export const FadeIn = ({ children, style }: CommonMotionProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={style}
  >
    {children}
  </motion.div>
);

interface StaggerParentProps {
  children?: React.ReactNode;
  stagger?: number;
}

const StaggerParentVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
  },
};

export const StaggerParent = ({ children }: StaggerParentProps) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={StaggerParentVariants}
  >
    {children}
  </motion.div>
);


const JumpInVariants: Variants = {
  initial: {
    opacity: 0,
    y: -100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -100,
  },
};

/**
 * Jump in
 */
export const JumpIn = ({ children, style }: CommonMotionProps) => (
  <motion.div
    variants={JumpInVariants}
    style={style}
  >
    {children}
  </motion.div>
);
