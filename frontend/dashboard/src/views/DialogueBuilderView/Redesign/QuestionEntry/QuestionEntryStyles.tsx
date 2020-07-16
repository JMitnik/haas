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

export const QuestionEntryViewContainer = styled(Flex) <{ activeCTA: string | null, id: string }>`
  ${({ id, activeCTA, theme }) => css`
    position: relative;
    flex-direction: row;
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
    border-top-left-radius: ${theme.borderRadiuses.somewhatRounded};
    border-bottom-left-radius: ${theme.borderRadiuses.somewhatRounded};

    padding: 20px;
    padding-left: 30px;
    margin-bottom: 20px;
 `} 
`;

export const LinkContainer = styled(Flex)`
  ${({ theme }) => css`
    flex-direction: column;
    color: ${theme.colors.default.muted};
    padding: 20px 0px; 
    margin-bottom: 40px;
    margin-top: 20px; 
    justify-content: center; 
    justify-items: center; 
    border-bottom-right-radius: ${theme.borderRadiuses.somewhatRounded};
    border-top-right-radius: ${theme.borderRadiuses.somewhatRounded};
    border: 1px dashed;
    border-left: none;
 `}
`;

export const QuestionEntryContainer = styled(Flex)`
 ${({ theme }) => css`
    flex-direction: column;
    color: ${theme.colors.default.muted};
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
