import { motion } from 'framer-motion';
import React from 'react';

export const FadeFromTop = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 1, y: 150 }} animate={{ opacity: 1, y: 0 }}>
    {children}
  </motion.div>
);
