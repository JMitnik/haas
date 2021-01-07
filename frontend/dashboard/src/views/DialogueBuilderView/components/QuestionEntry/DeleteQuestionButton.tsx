import styled, { css } from 'styled-components';

const DeleteQuestionButton = styled.button`
  ${({ disabled }) => css`
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: #f6f7f9;
    color: #a1a2a5;
    padding: 7.5px;
    border-radius: 100%;
    opacity: 0.7;
    cursor: pointer;
    transition: all 0.2s ease-in;
  
    svg {
      width: 15px;
      height: 15px;
    }

    ${disabled && css`
      pointer-events: none;
    `}

    ${!disabled && css`
      &:hover {
        transition: all 0.2s ease-in;
        opacity: 0.9;
        background: #e1e2e5;
      }
    `}
  `}
`;

export default DeleteQuestionButton;
