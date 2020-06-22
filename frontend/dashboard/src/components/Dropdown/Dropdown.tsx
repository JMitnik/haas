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
    border: 1px solid ${theme.colors.default.normalAlt};
    left: 0;
    top: 100%;
    padding: 8px 12px;
    box-shadow: 0px 3px 1px 1px rgba(0, 0, 0, 0.05);
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
