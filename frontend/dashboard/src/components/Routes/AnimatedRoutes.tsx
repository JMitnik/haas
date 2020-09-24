import { AnimatePresence } from 'framer-motion';
import { Switch, useLocation } from 'react-router';
import React from 'react';

const AnimatedRoutes = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <Switch location={location} key={location.pathname}>
        {children}
      </Switch>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
