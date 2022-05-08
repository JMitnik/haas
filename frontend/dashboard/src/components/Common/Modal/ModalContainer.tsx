import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface ModalContainerProps {
  children: React.ReactNode;
}

export const ModalContainer = ({ children }: ModalContainerProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    {children}
  </motion.div>
);
