import { ReactNode } from 'react';
import * as UI from '@haas/ui';

import { QuestionNode } from '../../types/core-types';

interface ChoiceNodeButtonLayoutProps {
  node: QuestionNode;
  children: ReactNode;
}

export const ChoiceNodeButtonLayout = ({ children }: ChoiceNodeButtonLayoutProps) => {
  return (
    <UI.Grid gridTemplateColumns={['1fr', '1fr 1fr']} gridGap={1}>
      {children}
    </UI.Grid>
  );
}
