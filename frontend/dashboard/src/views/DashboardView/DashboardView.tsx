import React from 'react';
import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import { Polygon } from '@visx/shape';
import { Group } from '@visx/group';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { motion } from 'framer-motion';

import { useGetWorkspaceDialogueStatisticsQuery } from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';
import useElementSize from 'hooks/useElementSize';
import { useState } from 'react';
import { useEffect } from 'react';
import { HexagonItem } from '../../components/Analytics/WorkspaceGrid/HexagonItem';
import { WorkspaceGrid } from 'components/Analytics/WorkspaceGrid/WorkspaceGrid.tsx';
import { WorkspaceGridAdapter } from 'components/Analytics/WorkspaceGrid/WorkspaceGridAdapter';

const GRID_BG_COLOR = '#e9eff5';
export const DashboardView = () => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();
  const [gridData, setGridData] = useState<any[]>([]);

  const height = 600;
  const width = 500;

  return (
    <>
      <UI.ViewHead>
          <UI.ViewTitle>{t('views:dashboard')}</UI.ViewTitle>
        </UI.ViewHead>
        <UI.ViewBody>
          <WorkspaceGridAdapter
            backgroundColor="#e9eff5"
            height={600}
            width={500}
          />
        </UI.ViewBody>
    </>
  )
}
