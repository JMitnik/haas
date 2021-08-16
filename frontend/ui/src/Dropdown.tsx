import { createPortal } from 'react-dom';
import React, { useRef, useState, useEffect } from 'react';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import { AnimatePresence, motion } from 'framer-motion';
import styled, { css } from 'styled-components';

import { Div } from './Generics';
import { Icon } from './Icon';
import { ChevronDown } from 'react-feather';
import { List, ListItem } from './Lists';
import { Button } from './Buttons';


export const DropdownOverlayContainer = styled.div<{left?: string, right?: string, top?: string, bottom?: string, minWidth?: number} >`
  ${({ theme, minWidth }) => css`
    background: ${theme.colors.white};
    border-radius: 5px;
    border: 1px solid ${theme.colors.default.normalAlt};
    min-width: ${minWidth || 300}px;
    max-width: 100%;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
    z-index: ${theme.zIndices.dropdown};
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
    [ref, handler],
  );
};

interface DropdownProps {
  renderOverlay?: ({ onClose }: any) => React.ReactNode;
  children?: ({ onOpen, onClose }: any) => React.ReactNode;
  placement?: Placement;
  offset?: [number, number];
  minWidth?: number;
}

export const Dropdown = ({ children, renderOverlay, placement = 'right-start', offset = [0, 12], minWidth }: DropdownProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null);
  const [toggleRef, setToggleRef] = useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(ref, () => setIsOpen(false));
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
            {createPortal(
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
        ref={setToggleRef}
      >
        <>
          {children?.({ onOpen: handleToggleDropdown, onClose: handleClose })}
        </>
      </Div>
    </>
  );
};

interface DropdownButtonProps {
  options: { value: string, label: string }[];
  children?: React.ReactNode;
  onClick?: (item: any) => void;
}

const InnerDropdownButton = styled(Button)`
  background: white !important;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
`;

export const DropdownButton = ({ options, children, onClick }: DropdownButtonProps) => {
  return (
    <Dropdown renderOverlay={({ onClose }) => (
      <List>
        {options.map((option, index) => (
          <ListItem key={index} onClick={() => {onClick?.(option.value); onClose()}}>{option.label}</ListItem>
        ))}
        </List>
    )}>
      {({ onOpen }) => (
        <InnerDropdownButton onClick={onOpen}>
          {children}
          <Icon ml={1}>
            <ChevronDown />
          </Icon>
        </InnerDropdownButton>
      )}
    </Dropdown>
  )
}
