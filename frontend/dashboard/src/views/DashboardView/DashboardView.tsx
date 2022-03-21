import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { WorkspaceGridAdapter } from 'components/Analytics/WorkspaceGrid/WorkspaceGridAdapter';

export const DashboardView = () => {
  const { t } = useTranslation();

  return (
    <>
      <UI.ViewHead>
        <UI.ViewTitle>{t('views:dashboard')}</UI.ViewTitle>
      </UI.ViewHead>
      <UI.ViewBody padding={0}>
        <UI.Div>
          <UI.Grid>
            <UI.Div>
              <WorkspaceGridAdapter
                backgroundColor="#f5f3fa"
                height={800}
                width={900}
              />
            </UI.Div>
          </UI.Grid>
        </UI.Div>
      </UI.ViewBody>
    </>
  );
};
