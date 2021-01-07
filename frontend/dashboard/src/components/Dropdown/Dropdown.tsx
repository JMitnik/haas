import React, { useRef, useState } from 'react';

import { Div } from '@haas/ui';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import useOnClickOutside from 'hooks/useClickOnOutside';

import { AnimatePresence, motion } from 'framer-motion';
import { DropdownContainer, DropdownOverlayContainer } from './DropdownStyles';

interface DropdownProps {
  renderOverlay?: React.ReactNode;
  children?: React.ReactNode;
  placement?: Placement;
  offset?: [number, number];
  minWidth?: number;
}

const Dropdown = ({ children, renderOverlay, placement = 'right-start', offset = [0, 12], minWidth }: DropdownProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null);
  const [toggleRef, setToggleRef] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(ref, () => setIsOpen(false));
  const { styles, attributes } = usePopper(toggleRef, overlay, {
    placement,
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

  return (
    <DropdownContainer ref={ref} onClick={(e) => e.stopPropagation()}>
      <AnimatePresence>
        {isOpen ? (
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
              <DropdownOverlayContainer minWidth={minWidth}>
                {renderOverlay}
              </DropdownOverlayContainer>
            </motion.div>
          </Div>
        ) : null}
      </AnimatePresence>

      <Div
        height="100%"
        useFlex
        alignItems="center"
        justifyContent="center"
        width="100%"
        ref={setToggleRef}
        onClick={(e) => handleToggleDropdown(e)}
      >
        <>
          {children}
        </>
      </Div>
    </DropdownContainer>
  );
};

export default Dropdown;
