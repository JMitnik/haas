import * as UI from '@haas/ui';
import React from 'react';

import { View } from 'layouts/View';
import { WorkspaceGridAdapter } from 'components/Analytics/WorkspaceGrid/WorkspaceGridAdapter';
import theme from 'config/theme';

export const DashboardView = () => (
  <View documentTitle="haas | Overview">
    <UI.Div>
      <UI.Div>
        <WorkspaceGridAdapter
          backgroundColor={theme.colors.neutral[500]}
          height={600}
          width={900}
        />
      </UI.Div>
    </UI.Div>
  </View>
);
