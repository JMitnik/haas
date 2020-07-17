import styled, { css } from 'styled-components/macro';

import { Div, Flex, H4, Span } from '@haas/ui';

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
    margin-bottom: 40px;
 `} 
`;

export const AddChildContainer = styled(Flex)`
  ${({ theme }) => css`
    position: absolute; 
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    bottom: 0; 
    left: 50%;
    transform: translate(-50%, -25px);
    min-width: 250px;
    color: ${theme.colors.default.darkest};
    border-radius: ${theme.borderRadiuses.rounded};
    background: ${theme.colors.default.dark}; 
 `}
`;

export const LinkContainer = styled(Flex) <{ hasCTA?: Boolean }>`
  ${({ theme, hasCTA }) => css`
    flex-direction: column;
    justify-content: center; 
    justify-items: center;

    color: ${theme.colors.default.muted};
    margin-bottom: 40px;
    
    ${!hasCTA && css`
      border-color: ${theme.colors.default.darkest};
      opacity: 0.4;
      border: 1px dashed;
    `}
    
    ${hasCTA && css`
      border: none;
      background: ${theme.colors.default.dark};
    `}

    border-left: none; 
    border-bottom-right-radius: ${theme.borderRadiuses.somewhatRounded};
    border-top-right-radius: ${theme.borderRadiuses.somewhatRounded};
 `}
`;

export const TypeSpan = styled(Span)`
   ${({ theme }) => css`
   color: ${theme.colors.default.darkest};
 `}
`;

export const QuestionEntryContainer = styled(Flex)`
 ${({ theme }) => css`
    flex-direction: column;
    color: ${theme.colors.default.muted};
 `}
`;

export const AddChildIconContainer = styled(Div)`
   ${({ theme }) => css`
   color: ${theme.colors.default.darkest};
    svg {
        color: ${theme.colors.default.darkest};
        width: 15px;
        height: 15px;
    }
  `}

  opacity: 0.9;
  cursor: pointer;
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
