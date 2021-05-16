import styled, { css } from 'styled-components';

export const DropdownContainer = styled.div`
  position: relative;
`;

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
