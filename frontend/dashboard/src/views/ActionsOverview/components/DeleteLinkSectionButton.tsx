import styled, { css } from 'styled-components/macro';

const DeleteLinkSesctionButton = styled.button`
   ${({ disabled, theme }) => css`
    ${!disabled && css`
        &:hover {
        transition: all 0.2s ease-in;
        opacity: 0.9;
        background: #e1e2e5;
      }
    `}
    svg {
        color: ${theme.colors.default.darkest};
        width: 7.5px;
        height: 7.5px;
    }
  `}
  position: absolute;
  top: 5px;
  right: 5px;
  border: none;
  background: #f6f7f9;
  color: #a1a2a5;
  padding: 5px;
  border-radius: 100%;

  

  opacity: 0.9;
  cursor: pointer;
  transition: all 0.2s ease-in;
`;

export default DeleteLinkSesctionButton;
