import { Route, RouteProps } from 'react-router';
import { Variants, motion } from 'framer-motion';
import React from 'react';

const routeAnimation: Variants = {
  initial: {
    opacity: 0,
    transition: {
      opacity: { duration: 0.2, type: 'tween' },
    },
  },
  enter: {
    opacity: 1,
    transition: {
      opacity: { duration: 0.2, type: 'tween' },
    },
  },
  exit: {
    opacity: 0,
    transition: {
      opacity: { duration: 0.2, type: 'tween' },
    },
  },
};

const AnimatedRoute = ({ children, ...routeProps }: RouteProps) => (
  <motion.div
    variants={routeAnimation}
    initial="initial"
    animate="enter"
    exit="exit"
    style={{ height: '100%' }}
  >
    <Route {...routeProps}>
      {children}
    </Route>
  </motion.div>
);

export default AnimatedRoute;
