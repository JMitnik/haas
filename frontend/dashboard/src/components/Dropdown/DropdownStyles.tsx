import styled, { css } from 'styled-components/macro';

export const DropdownContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DropdownOverlayContainer = styled.div`
  ${({ theme }) => css`
    background: ${theme.colors.white};
    border-radius: ${theme.borderRadiuses.subtleRounded};
    position: absolute;
    border: 1px solid ${theme.colors.default.normalAlt};
    left: 0;
    top: 100%;
    box-shadow: 0px 3px 1px 1px rgba(0, 0, 0, 0.05);
    z-index: ${theme.zIndices.dropdown};
  `}
`;
