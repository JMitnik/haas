import React from 'react';

import { H3 } from '@haas/ui';

import ModuleContainer from '../Module';

const NegativePathsModule = ({ negativePaths }: { negativePaths: any }) => (
  <ModuleContainer>
    <H3>Top negative results</H3>

    <ol>
      {negativePaths && negativePaths.map(({ answer, quantity }: { answer: string, quantity: number }) => (
        <li key={`${answer}-${quantity}`}>
          {`${answer} (${quantity} answer(s))`}
        </li>
      ))}
    </ol>
  </ModuleContainer>
);

export default NegativePathsModule;
