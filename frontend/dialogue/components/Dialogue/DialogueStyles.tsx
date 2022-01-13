import styled, { css } from 'styled-components';

export const DialogueContainer = styled.div`
  ${({ theme }) => css`
    height: 100%;
    padding: ${theme.gutter}px 0;
    width: ${theme.containerWidth}px;
    margin: 0 auto;
  `}
`;
