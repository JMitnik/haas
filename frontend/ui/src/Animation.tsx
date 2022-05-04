import React from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
}

export const FadeIn = ({ children }: FadeInProps) => (
  <motion.div
    initial={{ opacity: 0, x: '-1', }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div >
)
