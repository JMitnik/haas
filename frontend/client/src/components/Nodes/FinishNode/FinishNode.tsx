import React from 'react';

import { Div, H2, H4 } from '@haas/ui';
import useDialogueFinish from 'hooks/use-dialogue-finish';

import { FinishNodeContainer } from './FinishNodeStyles';

const FinishNode = () => {
  const { isFinished } = useDialogueFinish();

  return (
    <FinishNodeContainer>
      <Div>
        {isFinished && (
          <Div>We are done!</Div>
        )}
        <H2>Thank you for participating!</H2>
        <H4 color="white" textAlign="center">
          We will strive towards making you
          {' '}
          <i>happier.</i>
        </H4>
      </Div>
    </FinishNodeContainer>
  );
};

export default FinishNode;
