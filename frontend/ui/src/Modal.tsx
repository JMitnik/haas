import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { Div } from './Generics';

export const ModalBody = styled(Div)`
  position: absolute;
  top: 50%;
  left: 50%;
`;

if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement('#root');

const useOnClickOutside = (ref: any, handler: any) => {
  useEffect(
    () => {
      const listener = (event: any) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}


export const Modal = ({ isOpen, children, onClose }: {isOpen: boolean, children: React.ReactNode, onClose: any } ) => {
  const ref = useRef<any>(null);
  useOnClickOutside(ref, onClose);

  return (
    <ReactModal
      isOpen={isOpen} 
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
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
      <Div ref={ref}>
        <motion.div animate={{ y: 0, opacity: 1 }} initial={{ y: 200, opacity: 0 }}>
          {children}
        </motion.div>
      </Div>
    </ReactModal>
  );
};