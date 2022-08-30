import { createPortal } from 'react-dom';
import React, { useEffect, useRef, useState } from 'react';

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
  defaultCloseOnClickOutside?: boolean;
  isRelative?: boolean;
}

const Dropdown = ({
  children,
  renderOverlay,
  placement = 'right-start',
  offset = [0, 12],
  minWidth,
  defaultCloseOnClickOutside = true,
  isRelative,
}: DropdownProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null);
  const [toggleRef, setToggleRef] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [closeClickOnOutside, setCloseClickOnOutside] = useState(defaultCloseOnClickOutside);

  useOnClickOutside(ref, () => !!closeClickOnOutside && setIsOpen(false));
  const { styles, attributes } = usePopper(toggleRef, overlay, {
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
    setIsOpen((isOpen) => !isOpen);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <>
            {isRelative ? (
              <Div
                zIndex={1}
                ref={setOverlay}
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
                    {renderOverlay?.({ setCloseClickOnOutside, onClose: handleClose })}
                  </DropdownOverlayContainer>
                </motion.div>
              </Div>
            ) : createPortal(
              <Div
                ref={setOverlay}
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
                    {renderOverlay?.({ setCloseClickOnOutside, onClose: handleClose })}
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
        ref={setToggleRef}
      >
        <>
          {children?.({ setCloseClickOnOutside, onOpen: handleToggleDropdown, onClose: handleClose })}
        </>
      </Div>
    </>
  );
};

export default Dropdown;
