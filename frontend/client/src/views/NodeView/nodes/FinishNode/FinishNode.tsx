import React from 'react';

import { Div, H2, H4 } from '@haas/ui';
import useDialogueFinish from 'hooks/use-dialogue-finish';

import { FinishNodeContainer } from './FinishNodeStyles';

const FinishNode = () => {
  useDialogueFinish();

  return (
    <FinishNodeContainer>
      <H2 color="white">Thank you for participating!</H2>
      <H4 color="white" textAlign="center">
        We will strive towards making you
        {' '}
        <i>happier.</i>
      </H4>
    </FinishNodeContainer>
  );
};

export default FinishNode;
