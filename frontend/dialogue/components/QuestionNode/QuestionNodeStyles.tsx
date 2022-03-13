import * as UI from '@haas/ui';
import styled from 'styled-components';

export const QuestionNodeContainer = styled(UI.Div)`
  height: 100%;
  flex: 100%;
  display: flex;
  flex-direction: column;
`;

export const CenterDialogueLogo = styled(UI.Div)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  bottom: 50%;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
`;
