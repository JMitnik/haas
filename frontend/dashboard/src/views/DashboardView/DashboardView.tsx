import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { View } from 'layouts/View';
import { WorkspaceGridAdapter } from 'components/Analytics/WorkspaceGrid/WorkspaceGridAdapter';
import { useUser } from 'providers/UserProvider';
import theme from 'config/theme';

import { getDayGreeting } from './DashboardView.helpers';

export const DashboardView = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  const dayGreeting = getDayGreeting();

  return (
    <View documentTitle="haas | Overview">
      <UI.FadeIn>
        <UI.ViewHead>
          <UI.ViewTitle>
            {t('overview')}
          </UI.ViewTitle>
          <UI.ViewSubTitle>
            {t(dayGreeting, { user: user?.firstName })}
          </UI.ViewSubTitle>
        </UI.ViewHead>
        <UI.ViewBody>
          <UI.Div>
            <UI.Grid gridTemplateRows="1fr 2fr">
              <UI.Div>
                <WorkspaceGridAdapter
                  backgroundColor={theme.colors.gray[50]}
                  height={600}
                  width={900}
                />
              </UI.Div>
            </UI.Grid>
          </UI.Div>
        </UI.ViewBody>
      </UI.FadeIn>
    </View>
  );
};
