import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { CampaignTimeline } from 'components/Campaign/CampaignTimeline';
import { useGetDeliveryQuery } from 'types/generated-types';

interface DeliveryModalCardProps {
  id: string;
}

export const DeliveryModalCard = ({ id }: DeliveryModalCardProps) => {
  const { t } = useTranslation();
  const { data, loading, error } = useGetDeliveryQuery({
    variables: {
      deliveryId: id,
    },
  });

  if (loading) {
    return <UI.Loader />;
  }

  const delivery = data?.delivery;

  return (
    <UI.Card maxWidth={1200} mx="auto">
      <UI.ModalHead>
        <UI.ModalTitle>{t('details')}</UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        {error && (
          <UI.ErrorPane header="Server Error" text={error.message} />
        )}
        {delivery && (
          <>
            <UI.Stack mb={4}>
              <UI.Div>
                <UI.Helper mb={1}>{t('first_name')}</UI.Helper>
                {delivery?.deliveryRecipientFirstName}
              </UI.Div>
              <UI.Div>
                <UI.Helper mb={1}>{t('last_name')}</UI.Helper>
                {delivery?.deliveryRecipientLastName}
              </UI.Div>

              <UI.Div>
                <UI.Helper mb={1}>{t('email')}</UI.Helper>
                {delivery?.deliveryRecipientEmail}
              </UI.Div>
              <UI.Div>
                <UI.Helper mb={1}>{t('phone')}</UI.Helper>
                {delivery?.deliveryRecipientPhone}
              </UI.Div>
            </UI.Stack>

            <UI.Hr />

            <UI.SectionHeader mb={1} color="teal.600">{t('events')}</UI.SectionHeader>
            <CampaignTimeline
              delivery={delivery as any}
            />
          </>
        )}

      </UI.ModalBody>
    </UI.Card>
  );
};
