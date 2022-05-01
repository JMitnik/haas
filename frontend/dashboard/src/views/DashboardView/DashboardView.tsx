import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { WorkspaceGridAdapter } from 'components/Analytics/WorkspaceGrid/WorkspaceGridAdapter';
import theme from 'config/theme';

export const DashboardView = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* <UI.ViewHead>
        <UI.ViewTitle>{t('views:dashboard')}</UI.ViewTitle>
      </UI.ViewHead> */}
      <UI.ViewBody>
        <UI.Div px={4} py={3}>
          <UI.Text mb={72} color="main.500" fontWeight={700} fontSize="1.4rem">
            Welcome back Jonathan,
            {' '}
            you have 30
            {' '}
            new interactions, and one
            {' '}
            <UI.Span color="red.500">strong one</UI.Span>
            .
          </UI.Text>
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
        </UI.Div>
      </UI.ViewBody>
    </>
  );
};
