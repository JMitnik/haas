import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components/macro';

import { Div } from '@haas/ui';
import useOnClickOutside from 'hooks/useClickOnOutside';

const DropdownContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DropdownOverlayContainer = styled.div`
  ${({ theme }) => css`
    background: ${theme.colors.white};
    border-radius: ${theme.borderRadiuses.subtleRounded};
    position: absolute;
    left: 0;
    padding: 8px 12px;
    box-shadow: 0px 3px 1px 1px rgba(0, 0, 0, 0.10);
    z-index: ${theme.zIndices.dropdown};
  `}
`;

interface DropdownProps {
  renderOverlay?: React.ReactNode;
  children?: React.ReactNode;
}

const Dropdown = ({ children, renderOverlay }: DropdownProps) => {
  const ref = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(ref, () => setIsOpen(false));

  const handleOpenDropdown = (event: any) => {
    event.stopPropagation();
    setIsOpen(true);
  };

  return (
    <DropdownContainer>
      {isOpen && (
        <DropdownOverlayContainer>
          {renderOverlay}
        </DropdownOverlayContainer>
      )}

      <Div onClick={(e) => handleOpenDropdown(e)} ref={ref}>
        {children}
      </Div>
    </DropdownContainer>
  );
};

export default Dropdown;
