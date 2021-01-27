import { Route, RouteProps } from 'react-router';
import { Variants, motion } from 'framer-motion';
import React from 'react';

const routeAnimation: Variants = {
  initial: {
    x: '-10%',
    opacity: 0,
  },
  enter: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: '-10%',
    opacity: 0,
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
