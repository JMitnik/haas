import React, { useRef, useState } from 'react';

import { Div } from '@haas/ui';
import useOnClickOutside from 'hooks/useClickOnOutside';

import { DropdownContainer, DropdownOverlayContainer } from './DropdownStyles';

interface DropdownProps {
  renderOverlay?: React.ReactNode;
  children?: React.ReactNode;
}

const Dropdown = ({ children, renderOverlay }: DropdownProps) => {
  const ref = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(ref, () => setIsOpen(false));

  const handleToggleDropdown = (event: any) => {
    event.stopPropagation();
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <DropdownContainer onClick={(e) => e.stopPropagation()} ref={ref}>
      {isOpen && (
        <DropdownOverlayContainer>
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
