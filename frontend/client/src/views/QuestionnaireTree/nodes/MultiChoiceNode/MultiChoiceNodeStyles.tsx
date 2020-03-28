import styled, { css } from 'styled-components/macro';
import { ActiveNodeContainer } from '../NodeStyles';
import { Button } from '@haas/ui';

export const MultiChoiceNodeContainer = styled(ActiveNodeContainer)`
  height: 100%;

  ${Button} {
    min-width: 400px;
    max-width: 300px;
  }
`;
