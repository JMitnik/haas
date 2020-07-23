import styled, { css } from 'styled-components/macro';

const DeleteCTAButton = styled.button`
   ${({ disabled }) => css`
    ${!disabled && css`
        &:hover {
        transition: all 0.2s ease-in;
        opacity: 0.9;
        background: #e1e2e5;
      }
    `}
  `}
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: #f6f7f9;
  color: #a1a2a5;
  padding: 7.5px;
  border-radius: 100%;

  svg {
    width: 15px;
    height: 15px;
  }

  opacity: 0.7;
  cursor: pointer;
  transition: all 0.2s ease-in;
`;

export default DeleteCTAButton;
