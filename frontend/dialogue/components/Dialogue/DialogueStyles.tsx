import styled, { css } from 'styled-components';

export const DialogueRootContainer = styled.div`
  flex: 100%;
  display: flex;
  flex-direction: column;
`;

export const DialogueContainer = styled.div`
  ${({ theme }) => css`
    height: 100%;
    padding: ${theme.gutter}px 0;
    width: ${theme.containerWidth}px;
    max-width: 100%;
    margin: 0 auto;

    flex: 100%;
    display: flex;
    flex-direction: column;

    @media ${theme.media.mob} {
      padding: ${theme.gutter}px;
    }
  `}
`;
