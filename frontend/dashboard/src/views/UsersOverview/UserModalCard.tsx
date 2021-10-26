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

  const userOfCustomer = data?.customer?.userCustomer;

  return (
    <UI.ModalCard onClose={onClose}>
      <UI.ModalHead>
        <UI.ModalTitle>{t('details')}</UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        {error && (
          <UI.ErrorPane header="Server Error" text={error.message} />
        )}
        {userOfCustomer && (
          <>
            <UI.Stack mb={4}>
              <UI.Div>
                <UI.Helper mb={1}>{t('first_name')}</UI.Helper>
                {userOfCustomer?.user?.firstName || 'None'}
              </UI.Div>
              <UI.Div>
                <UI.Helper mb={1}>{t('last_name')}</UI.Helper>
                {userOfCustomer?.user?.lastName || 'None'}
              </UI.Div>

              <UI.Div>
                <UI.Helper mb={1}>{t('email')}</UI.Helper>
                {userOfCustomer?.user?.email}
              </UI.Div>

              <UI.Div>
                <UI.Helper mb={1}>{t('phone')}</UI.Helper>
                {userOfCustomer?.user?.phone || 'None'}
              </UI.Div>

              <UI.Div>
                <UI.Helper mb={1}>{t('role')}</UI.Helper>
                {userOfCustomer?.role?.name || 'None'}
              </UI.Div>

            </UI.Stack>

            <UI.Hr />
          </>
        )}

      </UI.ModalBody>
    </UI.ModalCard>
  );
};
