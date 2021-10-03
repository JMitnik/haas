import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { X } from 'react-feather';
import { CloseIcon } from './assets/icon-close';
import ReactModal from 'react-modal';
import styled, { css } from 'styled-components';
import { Paragraph } from './Type';
import { Div } from './Generics';
import { Card } from '.';

export const ModalBody = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter}px 0;
    overflow-y: scroll;
    height: 60vh;
  `}
`;

if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement('#root');

const CloseIconWrapper = styled.button`
  ${({ theme }) => css`
    position: absolute;
    top: 24px;
    right: 24px;
    width: 1rem;
    height: 1rem;
    color: ${theme.colors.gray[600]};
  `}
`;

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

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: any;
  willCloseOnOutsideClick?: boolean;
}

export const Modal = ({
  isOpen,
  children,
  onClose,
  willCloseOnOutsideClick = true
}: ModalProps) => {
  const ref = useRef<any>(null);
  useOnClickOutside(ref, () => {
    if (willCloseOnOutsideClick) {
      onClose();
    }
  });

  return (
    <AnimatePresence key="modal">
      <motion.div
        key={isOpen ? 'open' : 'no'} exit={{ opacity: 0 }}>
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
              padding: 24,
              borderRadius: '10px',
              left: '50%',
              top: '40%',
              margin: '0px auto',
              overflow: 'initial',
              width: '100%',
              transform: 'translateX(-50%) translateY(-50%)'
            }
          }}
        >
          <Div ref={ref}>
            <motion.div
              key="modal"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
            >
              {children}
            </motion.div>
          </Div>
        </ReactModal>
      </motion.div>
    </AnimatePresence >
  );
};

export const ModalTitle = styled(Paragraph)``;

export const ModalHead = styled(Div)`
  ${({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.gray[100]};

    ${ModalTitle} {
      color: ${theme.colors.gray[800]};
      font-size: 1.5rem;
      font-weight: 600;
    }
  `}
`;

interface ModalCardProps {
  children: React.ReactNode;
  onClose: () => void;
  minWidth?: number;
  maxWidth?: number;
}

const CloseButtonContainer = styled.button.attrs({ type: 'button' })`
  ${({ theme }) => css`
    position: absolute;
    top: 12px;
    right: 12px;
    width: 1.2rem;
    height: 1.2rem;
    color: ${theme.colors.gray[400]};
    transition: color ease-in 0.2s;

    &:hover {
      color: ${theme.colors.gray[600]};
      transition: color ease-in 0.2s;
    }
  `}
`;

const CloseButton = ({ onClose }: any) => (
  <CloseButtonContainer onClick={onClose}>
    <CloseIcon />
  </CloseButtonContainer>
);

const ModalCardContainer = styled(Div)`
  position: relative;

  ${Card} {
    margin: 0 auto;
  }

  ${CloseButtonContainer} {
  }
`;

export const ModalCard = ({ children, onClose, maxWidth = 600 }: ModalCardProps) => (
  <ModalCardContainer>
    <Card bg="white" noHover maxWidth={maxWidth} padding={4}>
      {!!onClose && (
        <CloseButton onClose={onClose} />
      )}
      {children}
    </Card>
  </ModalCardContainer>
)
