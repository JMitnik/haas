import React, { useRef, useState } from 'react';

import { Div } from '@haas/ui';
import useOnClickOutside from 'hooks/useClickOnOutside';

import { DropdownContainer, DropdownOverlayContainer } from './DropdownStyles';

interface DropdownProps {
  renderOverlay?: React.ReactNode;
  children?: React.ReactNode;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
}

const Dropdown = ({ children, renderOverlay, left, right, top, bottom }: DropdownProps) => {
  const ref = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(ref, () => setIsOpen(false));

  const handleToggleDropdown = (event: any) => {
    event.stopPropagation();
    setIsOpen((isOpen) => !isOpen);
  };

  const handleDropdownClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsOpen(false);
  };

  return (
    <DropdownContainer onClick={handleDropdownClick} ref={ref}>
      {isOpen && (
        <DropdownOverlayContainer left={left} right={right} top={top} bottom={bottom}>
          {renderOverlay}
        </DropdownOverlayContainer>
      )}

      <Div
        height="100%"
        useFlex
        alignItems="center"
        justifyContent="center"
        width="100%"
        onClick={(e) => handleToggleDropdown(e)}
      >
        {children}
      </Div>
    </DropdownContainer>
  );
};

export default Dropdown;
