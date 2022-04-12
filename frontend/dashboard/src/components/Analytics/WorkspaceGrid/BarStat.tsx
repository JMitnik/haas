// @prefix haas:comp
// @description Haas component

import * as UI from '@haas/ui';
import { useFormatter } from 'hooks/useFormatter';
import React from 'react';

interface BarStatProps {
  brand: string;
  fraction: number;
}

export const BarStat = ({ brand = 'green', fraction }: BarStatProps) => {
  const { formatFractionToPercentage } = useFormatter();

  const percentage = formatFractionToPercentage(fraction);

  return (
    <UI.Flex flexWrap="nowrap" alignItems="center">
      <UI.Div borderRadius={20} backgroundColor={`${brand}.50`} height={3} width="100%">
        <UI.Div width={percentage} borderRadius={20} backgroundColor={`${brand}.500`} height="100%" />
      </UI.Div>
      <UI.Span ml={2} style={{ whiteSpace: 'pre' }}>
        {percentage}
      </UI.Span>
    </UI.Flex>
  );
};
