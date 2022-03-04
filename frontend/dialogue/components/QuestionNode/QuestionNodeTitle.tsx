import styled, { css } from 'styled-components';

interface QuestionNodeTitleContainerProps {
  size: Size;
}

type Size = 'xs' | 'sm' | 'md' | 'lg';

export const QuestionNodeTitleContainer = styled.div.attrs({
  className: 'question-node-title',
})<QuestionNodeTitleContainerProps>`
  ${({ theme, size }) => css`
    text-align: left;
    font-size: 3rem;
    font-weight: 50;
    margin-bottom: ${theme.gutter}px;
    margin-top: ${theme.gutter}px;

    ${size === 'xs' && css`
      font-size: 1.1rem;

      @media (min-width: 601px) {
        font-size: 1.5rem;
      }
    `}

    ${size === 'sm' && css`
      font-size: 1.5rem;

      @media (min-width: 601px) {
        font-size: 1.8rem;
      }
    `}

    ${size === 'md' && css`
      font-size: 1.8rem;

      @media (min-width: 601px) {
        font-size: 2rem;
      }
    `}

    ${size === 'lg' && css`
      font-size: 2.5rem;

      @media (min-width: 601px) {
        font-size: 2.5rem;
      }
    `}
  `}
`;

/**
 * Use content of children to derive the "font-size".
 *
 * The more content, the smaller we should make our fonts.
 * @param textLength
 */
const deriveFontSize = (textLength: number): Size => {
  switch (true) {
    case textLength < 30:
      return 'lg';
    case textLength >= 30 && textLength < 60:
      return 'md';
    default:
      return 'sm';
  }
}

export const QuestionNodeTitle = ({ children }: { children: string }) => {
  const textLength = children.length;
  const fontSize: Size = deriveFontSize(textLength);

  return (
    <QuestionNodeTitleContainer size={fontSize}>
      {children}
    </QuestionNodeTitleContainer>
  )
};
