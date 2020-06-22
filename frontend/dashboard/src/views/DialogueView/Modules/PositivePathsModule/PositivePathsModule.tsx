import React from 'react';

import { H3 } from '@haas/ui';

import ModuleContainer from '../Module';

const PositivePathsModule = ({ positivePaths }: { positivePaths: any }) => (
  <ModuleContainer>
    <H3>Top positive results</H3>

    <ol>
      {positivePaths && positivePaths.map(({ answer, quantity }: { answer: string, quantity: number }) => (
        <li key={`${answer}-${quantity}`}>
          {`${answer} (${quantity} answer(s))`}
        </li>
      ))}
    </ol>
  </ModuleContainer>
);

export default PositivePathsModule;
