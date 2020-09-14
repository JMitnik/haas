import { Div, Text } from '@haas/ui';
import { ReactComponent as ServerDownImage } from 'assets/images/undraw_auth.svg';
import { useTranslation } from 'react-i18next';
import React from 'react';

const NotAuthorizedView = () => {
  const { t } = useTranslation();

  return (
    <Div
      useFlex
      flexDirection="column"
      justifyContent="center"
      height="100vh"
      maxWidth="600px"
      width="100%"
      margin="0 auto"
    >
      <Div mb={100}>
        <Text textAlign="center" color="gray.500" fontSize="2rem" fontWeight="200">
          {t('unauthorized')}
        </Text>
        <Text textAlign="center" color="gray.300" fontSize="1.5rem" fontWeight="100">
          {t('unauthorized_helper')}
        </Text>
      </Div>
      <Div pt={4} opacity={0.4}>
        <ServerDownImage width="100%" height="auto" />
      </Div>
    </Div>
  );
};

export default NotAuthorizedView;
