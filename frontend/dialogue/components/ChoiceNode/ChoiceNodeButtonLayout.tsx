import { ReactNode } from 'react';
import * as UI from '@haas/ui';

import * as Motion from '../Common/Motion';
import { QuestionNode } from '../../types/core-types';

interface ChoiceNodeButtonLayoutProps {
  node: QuestionNode;
  children: ReactNode;
}

export const ChoiceNodeButtonLayout = ({ children }: ChoiceNodeButtonLayoutProps) => {
  return (
    <Motion.StaggerParent>
      <UI.Grid gridTemplateColumns={['1fr', '1fr 1fr']} gridGap={1}>
        {children}
      </UI.Grid>
    </Motion.StaggerParent>
  );
}
