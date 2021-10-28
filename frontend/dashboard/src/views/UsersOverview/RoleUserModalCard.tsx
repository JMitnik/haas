import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { useCustomer } from 'providers/CustomerProvider';
import { useFindRoleByIdQuery, useGetUserCustomerFromCustomerQuery } from 'types/generated-types';

interface RoleUserModalCardProps {
  id: string;
  onClose: () => void;
}

/**
 * A modal used to display information of a user role after it being clicked on in the UsersOverview
 * @param object with an unique identifier as well as a onClose function to close the modal
 * @returns a pop-up modal displaying User role specific information
 */
export const RoleUserModalCard = ({ id, onClose }: RoleUserModalCardProps) => {
  const { t } = useTranslation();
  const { data, loading, error } = useFindRoleByIdQuery({
    variables: {
      input: {
        roleId: id,
      },
    },
  });

  if (loading) {
    return <UI.Loader />;
  }

  const userOfCustomer = data?.findRoleById;
  console.log('ROLE DATA: ', userOfCustomer);

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
              <UI.Div>Helemaal niks hier</UI.Div>
            </UI.Stack>

            <UI.Hr />
          </>
        )}

      </UI.ModalBody>
    </UI.ModalCard>
  );
};

export default RoleUserModalCard;
