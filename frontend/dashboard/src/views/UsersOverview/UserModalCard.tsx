import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { useCustomer } from 'providers/CustomerProvider';
import { useGetUserCustomerFromCustomerQuery } from 'types/generated-types';

interface UserModalCardProps {
  id: string;
  onClose: () => void;
}

export const UserModalCard = ({ id, onClose }: UserModalCardProps) => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();
  const { data, loading, error } = useGetUserCustomerFromCustomerQuery({
    variables: {
      id: activeCustomer?.id || '',
      userId: id,
    },
  });

  if (loading) {
    return <UI.Loader />;
  }

  const delivery = data?.customer?.userCustomer;

  console.log('USER: ', delivery);

  return (
    <UI.ModalCard onClose={onClose}>
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
          </>
        )}

      </UI.ModalBody>
    </UI.ModalCard>
  );
};
