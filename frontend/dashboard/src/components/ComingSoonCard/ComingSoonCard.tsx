import React from 'react';

import { Div, H4, Paragraph, Text } from '@haas/ui';
import { ReactComponent as InDevImage } from 'assets/images/undraw_dev.svg';
import { useTranslation } from 'react-i18next';

const ComingSoonCard = () => {
  const { t } = useTranslation();
  return (
    <Div maxWidth="600px" width="100%" margin="0 auto" mt="4">
      <Div mb={100}>
        <Text textAlign="center" color="gray.500" fontSize="2rem" fontWeight="200">
          {t('stay_tuned')}
        </Text>
        <Text textAlign="center" color="gray.300" fontSize="1.5rem" fontWeight="100">
          {t('stay_tuned_helper')}
        </Text>
      </Div>
      <Div pt={4} opacity={0.4}>
        <InDevImage width="100%" height="auto" />
      </Div>
    </Div>
  );
};

export default ComingSoonCard;
