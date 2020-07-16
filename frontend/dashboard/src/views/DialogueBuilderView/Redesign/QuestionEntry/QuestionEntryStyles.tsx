import styled, { css } from 'styled-components/macro';

import { Flex, H4, Span } from '@haas/ui';

export const QuestionEntryHeader = styled(H4)`
${({ theme }) => css`
  background-color: ${theme.colors.default.light};
  cursor: pointer;
`}`;

// export const QuestionEntryContainer = styled.div`
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
// `;

export const OverflowSpan = styled(Span)`
  ${({ theme }) => css`
    color: ${theme.colors.default.darkest};
  `}
  font-size: 1.2em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const QuestionEntryContainer = styled(Flex) <{ activeCTA: string | null, id: string }>`
 ${({ id, activeCTA, theme }) => css`
    position: relative;
    flex-direction: column;
    color: ${theme.colors.default.muted};

    ${!activeCTA && css`
    background-color: ${theme.colors.white};
    `};

    ${activeCTA === id && css`
    background-color: ${theme.colors.white};
    `};

    ${activeCTA && activeCTA !== id && css`
    background-color: ${theme.colors.white};
    opacity: 0.5;
    `};

    border: ${theme.colors.app.mutedOnDefault} 1px solid;
    padding: 20px;
    padding-left: 30px;
    margin-bottom: 20px;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
 `}
`;

export const DeleteQuestionOptionButtonContainer = styled.button`
  background: none;
  border: none;
  opacity: 0.1;
  cursor: pointer;
  transition: all 0.2s ease-in;
  margin-left: 1%;
  &:hover {
    transition: all 0.2s ease-in;
    opacity: 0.8;
  }
`;
