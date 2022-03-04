import * as UI from '@haas/ui';
import { ReactNode } from 'react';

import { QuestionNode } from '../../types/core-types'
import { GoBackButton } from '../Navigation/GoBackButton';

interface NodeLayoutProps {
  children: ReactNode;
  node: QuestionNode;
}

/**
 * Given a `node`, decide one of the layouts of the dialogue for this particular node.
 *
 * - Layout the title.
 * - Layout the main interaction.
 *
 * Note: this is mostly for future purposes if different layouts are needed. For now, default vertical
 * layout is used for both desktop and mobile.
 * @returns
 */
export const QuestionNodeLayout = ({ children }: NodeLayoutProps) => {
  return (
    <UI.ColumnFlex flex="100%" height="100%">
      <UI.Div>
        <GoBackButton/>
      </UI.Div>
      <UI.ColumnFlex flexGrow={1} justifyContent={['space-between', 'center']}>
        {children}
      </UI.ColumnFlex>
    </UI.ColumnFlex>
  )
}
