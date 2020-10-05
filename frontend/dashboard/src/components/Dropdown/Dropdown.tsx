import React, { useRef, useState } from 'react';

import { Div } from '@haas/ui';
import { Placement } from '@popperjs/core';
import { usePopper } from 'react-popper';
import useOnClickOutside from 'hooks/useClickOnOutside';

import { DropdownContainer, DropdownOverlayContainer } from './DropdownStyles';

interface DropdownProps {
  renderOverlay?: React.ReactNode;
  children?: React.ReactNode;
  placement?: Placement;
  offset?: [number, number];
}

const Dropdown = ({ children, renderOverlay, placement = 'right-start', offset = [0, 12] }: DropdownProps) => {
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
    <DropdownContainer ref={ref}>
      {isOpen ? (
        <DropdownOverlayContainer ref={setOverlay} style={styles.popper} {...attributes.popper}>
          {renderOverlay}
        </DropdownOverlayContainer>
      ) : null}

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
