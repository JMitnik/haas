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
      <UI.ViewBody>
        <UI.Div>
          <UI.Grid gridTemplateRows="1fr 2fr">
            <UI.Div>
              <WorkspaceGridAdapter
                backgroundColor="#f5f3fa"
                height={600}
                width={900}
              />
            </UI.Div>
          </UI.Grid>
        </UI.Div>
      </UI.ViewBody>
    </>
  );
};
