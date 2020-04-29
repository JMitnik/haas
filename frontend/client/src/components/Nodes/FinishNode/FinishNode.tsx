import React from 'react';
import { Div, H2, H3, H4 } from '@haas/ui';
import useJourneyFinish from 'hooks/use-journey-finish';
import { FinishNodeContainer } from './FinishNodeStyles';

const FinishNode = () => {
  const finish = useJourneyFinish();

  return (
    <FinishNodeContainer>
      <Div>
        <H2>Thank you for participating!</H2>
        <H4 color="white" textAlign="center">
          We will strive towards making you <i>happier.</i>
        </H4>
      </Div>
    </FinishNodeContainer>
  );
};

export default FinishNode;
