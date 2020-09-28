import styled, { css } from 'styled-components/macro';

export const DropdownContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DropdownOverlayContainer = styled.div<{left?: string, right?: string, top?: string, bottom?: string} >`
  ${({ theme, left = 'auto', right = 'auto', top = 'auto', bottom = 'auto' }) => css`
    background: ${theme.colors.white};
    border-radius: 5px;
    position: absolute;
    border: 1px solid ${theme.colors.default.normalAlt};
    left: ${left};
    right: ${right};
    min-width: 300px;
    max-width: 100%;
    top: ${top};
    bottom: ${bottom};
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    z-index: ${theme.zIndices.dropdown};
  `}
`;
