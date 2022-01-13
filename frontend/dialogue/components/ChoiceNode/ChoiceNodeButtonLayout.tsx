import { ReactNode } from 'react';
import * as UI from '@haas/ui';

import { QuestionNode } from '../../types/helper-types';

interface ChoiceNodeButtonLayoutProps {
  node: QuestionNode;
  children: ReactNode;
}

export const ChoiceNodeButtonLayout = ({ children }: ChoiceNodeButtonLayoutProps) => {
  return (
    <UI.Div>
      {children}
    </UI.Div>
  );
}
