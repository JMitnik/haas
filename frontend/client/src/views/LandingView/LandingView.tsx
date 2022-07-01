import { motion } from 'framer-motion';
import React from 'react';

import { FullScreenLayout } from 'layouts/FullScreenLayout';

/**
 * The Landing-view is the root view of haas, and renders if users land on client.haas.live.
 */
export const LandingView = () => (
  <FullScreenLayout>
    <motion.img
      src="logo-full.svg"
      alt="haas"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
    />
  </FullScreenLayout>
);
