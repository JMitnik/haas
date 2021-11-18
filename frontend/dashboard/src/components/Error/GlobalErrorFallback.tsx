import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { ReactComponent as ServerDownImage } from 'assets/images/404.svg';

export const GlobalErrorFallback = ({ error }: { error?: Error | undefined }) => {
  const { t } = useTranslation();

  if (error?.message.includes('Failed to fetch')) {
    console.log('Server is down!!!!');
  }

  console.log(error);

  return (
    <UI.Div minHeight="100vh" display="flex" alignItems="center">
      <UI.Div maxWidth="600px" width="100%" margin="0 auto" mt="4">
        <UI.Div mb={100}>
          <UI.Text textAlign="center" color="gray.500" fontSize="2rem" fontWeight="200">
            {t('server_down')}
          </UI.Text>
          <UI.Text textAlign="center" color="gray.300" fontSize="1.5rem" fontWeight="100">
            {t('server_down_helper')}
          </UI.Text>
        </UI.Div>
        <UI.Div pt={4} opacity={0.4}>
          <ServerDownImage width="100%" height="auto" />
        </UI.Div>
      </UI.Div>
    </UI.Div>
  );
};
