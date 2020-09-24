import React from 'react';

import { Div, Text } from '@haas/ui';
import { ReactComponent as ServerDownImage } from 'assets/images/404.svg';
import { useTranslation } from 'react-i18next';

const FallbackServerError = () => {
  const { t } = useTranslation();
  return (
    <Div maxWidth="600px" width="100%" margin="0 auto" mt="4">
      <Div mb={100}>
        <Text textAlign="center" color="gray.500" fontSize="2rem" fontWeight="200">
          {t('server_down')}
        </Text>
        <Text textAlign="center" color="gray.300" fontSize="1.5rem" fontWeight="100">
          {t('server_down_helper')}
        </Text>
      </Div>
      <Div pt={4} opacity={0.4}>
        <ServerDownImage width="100%" height="auto" />
      </Div>
    </Div>
  );
};

export default FallbackServerError;
