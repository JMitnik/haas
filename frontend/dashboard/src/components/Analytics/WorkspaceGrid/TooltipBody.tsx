import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { HexagonNode } from './HexagonItem';

interface TooltipBodyProps {
  node: HexagonNode;
}

export const TooltipBody = ({ node }: TooltipBodyProps) => {
  const { t } = useTranslation();

  return (
    <UI.Div>
      <UI.Flex>
        {node.impactScore}
      </UI.Flex>
    </UI.Div>
  );
};
