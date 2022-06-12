import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

export const QuestionEntryHeader = styled(UI.H4)`
${({ theme }) => css`
  background-color: ${theme.colors.default.light};
  cursor: pointer;
`}`;

export const ConditionContainer = styled(UI.Flex) <{ activeCTA: string | null, id: string }>`
  ${({ activeCTA, id, theme }) => css`
    color: ${theme.colors.default.darkest};
    background: ${theme.colors.white};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 25px;
    width: 60px;
    height: 60px;
    position: relative;

    border-top-left-radius: ${theme.borderRadiuses.somewhatRounded};
    border-bottom-left-radius: ${theme.borderRadiuses.somewhatRounded};

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
  `}
`;

export const OverflowSpan = styled(UI.Span)`
  ${({ theme }) => css`
    color: ${theme.colors.default.darkest};
    font-size: 1.2em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `}
`;

export const AddQuestionContainer = styled(UI.Flex)`
  ${({ theme }) => css`
    flex-direction: row;
    align-self: center;
    cursor: pointer;
    min-width: 500px;
    max-width: 800px;
    justify-content: center;
    align-items: center;
    background-color: ${theme.colors.default.lightest};
    color: ${theme.colors.default.muted};

    border: ${theme.colors.app.mutedOnDefault} 1px solid;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
    transition: all 0.2s ease-in;
    padding: 10px;
    margin-bottom: 40px;

    &:hover {
      background-color: ${theme.colors.white};
      box-shadow: 0 1px 3px 1px rgba(0,0,0,0.1);
    }
  `}
`;

export const QuestionEntryViewContainer = styled(UI.NewCard) <{ activeCTA: string | null, id: string }>`
  ${({ id, activeCTA, theme }) => css`
    position: relative;
    flex-direction: row;
    color: ${theme.colors.default.muted};
    border: ${theme.colors.app.mutedOnDefault} 1px solid;
    border-top-left-radius: ${theme.borderRadiuses.somewhatRounded};
    border-bottom-left-radius: ${theme.borderRadiuses.somewhatRounded};
    padding: 20px;
    padding-left: 30px;
    margin-bottom: 25px;

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
 `}
`;

export const AddChildContainer = styled(UI.Flex) <{ isDisabled?: Boolean }>`
  ${({ theme, isDisabled }) => css`
    position: absolute;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -10px);

    ${isDisabled && css`
      pointer-events: none;

      div > button {
        background-color: ${theme.colors.white};
        opacity: 0.5;
      }
    `}

 `}
`;

export const LinkContainer = styled(UI.Flex) <{ hasCTA?: Boolean }>`
  ${({ theme, hasCTA }) => css`
    flex-direction: column;
    justify-content: center;
    justify-items: center;
    border-left: none;
    border-bottom-right-radius: ${theme.borderRadiuses.somewhatRounded};
    border-top-right-radius: ${theme.borderRadiuses.somewhatRounded};
    color: ${theme.colors.default.muted};
    margin-bottom: 25px;

    ${!hasCTA && css`
      border-color: ${theme.colors.default.darkest};
      opacity: 0.4;
      border: 1px dashed;
    `}

    ${hasCTA && css`
      border: none;
      background: ${theme.colors.default.dark};
    `}
 `}
`;

export const ConditionSpan = styled(UI.Span)`
   ${({ theme }) => css`
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 40px;
    text-align: center;
    color: ${theme.colors.default.darkest};

    abbr {
      text-decoration: none;
    }
 `}
`;

export const TypeSpan = styled(UI.Span)`
  ${({ theme }) => css`
    color: ${theme.colors.default.darkest};
 `}
`;

export const DepthSpan = styled(UI.Span)`
  ${({ theme }) => css`
    margin-left: 5px;
    color: ${theme.colors.default.darkest};
    opacity: 0.5;
  `}
`;

export const QuestionEntryContainer = styled(UI.Flex)`
 ${({ theme }) => css`
    position: relative;
    flex-direction: column;
    color: ${theme.colors.default.muted};
 `}
`;

export const AddChildIconContainer = styled(UI.Div)`
  ${({ theme }) => css`
    opacity: 0.9;
    cursor: pointer;
    color: ${theme.colors.default.darkest};

    svg {
      color: ${theme.colors.default.darkest};
      width: 15px;
      height: 15px;
    }
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

export const QuestionNodeProblem = styled.div`
  ${({ theme }) => css`
    position: absolute;
    top: -12px;
    left: -12px;
    width: 24px;
    height: 24px;
    border-radius: 10px;
    background: ${theme.colors.yellow[200]};
    color: ${theme.colors.yellow[500]};

    > ${UI.Icon} {
      width: 24px;
      height: 24px;
      padding: 4px;
      display: flex;
      align-items: center;
    }

    svg {
      max-width: 100%;
    }
  `}
`;
