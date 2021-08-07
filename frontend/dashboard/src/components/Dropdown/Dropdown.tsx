import { createPortal } from 'react-dom';
import React, { useRef, useState } from 'react';

import { Div } from '@haas/ui';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import useOnClickOutside from 'hooks/useClickOnOutside';

import { AnimatePresence, motion } from 'framer-motion';
import { DropdownOverlayContainer } from './DropdownStyles';

interface DropdownProps {
  renderOverlay?: ({ onClose }: any) => React.ReactNode;
  children?: ({ onOpen, onClose }: any) => React.ReactNode;
  placement?: Placement;
  offset?: [number, number];
  minWidth?: number;
}

const Dropdown = ({
  children,
  renderOverlay,
  placement = 'right-start',
  offset = [0, 12],
  minWidth,
}: DropdownProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [overlayElement, setOverlayElement] = useState<HTMLDivElement | null>(null);
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(ref, () => setIsOpen(false));
  const { styles, attributes } = usePopper(referenceElement, overlayElement, {
    placement,
    strategy: 'fixed',
    modifiers: [{
      name: 'offset',
      options: {
        offset,
      },
    },
    ],
  });

  const handleToggleDropdown = (event: any) => {
    event.stopPropagation();
    setIsOpen((isOpenState) => !isOpenState);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <>
            {createPortal(
              <Div
                ref={setOverlayElement}
                style={{
                  ...styles.popper,
                  minWidth,
                }}
                {...attributes.popper}
              >
                <motion.div
                  style={{ minWidth }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                >
                  <DropdownOverlayContainer minWidth={minWidth} ref={ref} onClick={(e) => e.stopPropagation()}>
                    {renderOverlay?.({ onClose: handleClose })}
                  </DropdownOverlayContainer>
                </motion.div>
              </Div>,
              document.getElementById('popper_root') as HTMLElement,
            )}
          </>
        ) : null}
      </AnimatePresence>

      <Div
        display="inline-block"
        ref={setReferenceElement}
      >
        <>
          {children?.({ onOpen: handleToggleDropdown, onClose: handleClose })}
        </>
      </Div>
    </>
  );
};

export default Dropdown;
