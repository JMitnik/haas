import * as UI from '@haas/ui';
import styled from 'styled-components';

export const QuestionNodeContainer = styled(UI.Div)`
  height: 100%;
`;

export const QuestionNodeTitle = styled.div.attrs({
  className: 'question-node-title',
})`
  text-align: left;
  font-size: 3rem;
  font-weight: 50;
`;
