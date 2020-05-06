import styled, { css } from 'styled-components/macro';
import { Muted, Div, H4, Button, StyledLabel, StyledInput, Hr } from '@haas/ui';

export const QuestionEntryHeader = styled(H4)`
${({ theme }) => css`
  background-color: ${theme.colors.default.light};
`
}
  cursor: pointer;
`;

export const QuestionEntryContainer = styled.div`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
