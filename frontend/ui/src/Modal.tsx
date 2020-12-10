import { motion } from 'framer-motion';
import React from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components/macro';
import { Div } from './Generics';

export const ModalBody = styled(Div)`
  position: absolute;
  top: 50%;
  left: 50%;
`;

export const Modal = ({ isOpen, children, onClose }: {isOpen: boolean, children: React.ReactNode, onClose: any } ) => {
  return (
    <ReactModal 
      isOpen={isOpen} 
      onRequestClose={onClose}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 8000,
          backgroundColor: 'rgba(0, 0, 0, 0.35)'
        },
        content: {
          position: 'absolute',
          border: 0,
          background: 'transparent',
          overflow: 'initial',
          borderRadius: '4px',
          left: '0',
          bottom: '0',
          right: '0',
          top: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
          padding: '20px',
          margin: '0px auto',
          maxWidth: '100%',       
        }
      }}
    >
      <Div>
        <motion.div animate={{ y: 0, opacity: 1 }} initial={{ y: 200, opacity: 0 }}>
          {children}
        </motion.div>
      </Div>
    </ReactModal>
  );
};