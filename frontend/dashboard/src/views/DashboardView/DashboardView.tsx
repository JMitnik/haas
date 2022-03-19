import React from 'react';
import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';

import { Polygon } from '@visx/shape';
import { useGetWorkspaceDialogueStatisticsQuery } from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';

export const DashboardView = () => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();

  const width = 300;
  const height = 500;

  const { data } = useGetWorkspaceDialogueStatisticsQuery({
    variables: {
      startDateTime: '01-01-2022',
      endDateTime: '01-07-2022',
      workspaceId: activeCustomer?.id || '',
    },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <>
      <UI.ViewHead>
          <UI.ViewTitle>{t('views:dashboard')}</UI.ViewTitle>
        </UI.ViewHead>
        <UI.ViewBody>

        </UI.ViewBody>
    </>
  )
}
