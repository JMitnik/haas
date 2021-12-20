import * as UI from '@haas/ui';
import { ReactNode } from 'react';

import { QuestionNode } from 'types/helper-types'

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
export const NodeLayout = ({ children }: NodeLayoutProps) => {
  return (
    <UI.Container height="100%">
      <UI.ColumnFlex height="100%" justifyContent="space-between">
        {children}
      </UI.ColumnFlex>
    </UI.Container>
  )
}
