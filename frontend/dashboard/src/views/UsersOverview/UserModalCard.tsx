import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { useCustomer } from 'providers/CustomerProvider';
import { useGetUserCustomerFromCustomerQuery } from 'types/generated-types';
import useAuth from 'hooks/useAuth';

import { AssignDialoguePicker } from './AssignDialoguePicker';

interface UserModalCardProps {
  id: string;
  onClose: () => void;
}

/**
 * A modal used to display information of a user after it being clicked on in the UsersOverview
 * @param object with an unique identifier as well as a onClose function to close the modal
 * @returns a pop-up modal displaying User specific information
 */
export const UserModalCard = ({ id, onClose }: UserModalCardProps) => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();
  const { canAssignUsersToDialogue } = useAuth();
  const { data, loading } = useGetUserCustomerFromCustomerQuery({
    variables: {
      id: activeCustomer?.id || '',
      userId: id,
      input: {
        customerId: activeCustomer?.id || '',
        userId: id,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const userOfCustomer = data?.customer?.userCustomer;

  if (loading || !userOfCustomer) {
    return <UI.Loader />;
  }

  const { user } = userOfCustomer;

  const fullName = `${userOfCustomer?.user?.firstName} ${userOfCustomer?.user?.lastName}`;

  return (
    <UI.ModalCard maxWidth={1200} onClose={onClose} breakout>
      <UI.ModalHead>
        <UI.ModalTitle mb={2}>{fullName}</UI.ModalTitle>

        <UI.Stack>
          <UI.Grid gridTemplateColumns="auto 1fr" gridColumnGap={4} gridRowGap={2}>
            <UI.Div>
              <UI.FieldLabel>{t('first_name')}</UI.FieldLabel>
            </UI.Div>
            <UI.Div>
              {user?.firstName || t('unknown')}
            </UI.Div>

            <UI.Div>
              <UI.FieldLabel>{t('last_name')}</UI.FieldLabel>
            </UI.Div>

            <UI.Div>
              {user?.lastName || t('unknown')}
            </UI.Div>

            <UI.Div>
              <UI.FieldLabel>
                {t('email')}
              </UI.FieldLabel>
            </UI.Div>

            <UI.Div>
              {user?.email}
            </UI.Div>

            {user?.phone && (
              <>
                <UI.Div>
                  <UI.FieldLabel>{t('phone')}</UI.FieldLabel>
                </UI.Div>

                <UI.Div>
                  {user.phone}
                </UI.Div>
              </>
            )}

            <UI.Div>
              <UI.FieldLabel>{t('role')}</UI.FieldLabel>
            </UI.Div>

            <UI.Div>
              {userOfCustomer.role?.name}
            </UI.Div>
          </UI.Grid>
        </UI.Stack>
      </UI.ModalHead>

      {canAssignUsersToDialogue && (
        <UI.ModalBody>
          <UI.SectionHeader mb={2}>
            {t('assigned_dialogues')}
          </UI.SectionHeader>
          <AssignDialoguePicker
            onClose={onClose}
            assignedDialogues={userOfCustomer?.user?.assignedDialogues?.assignedDialogues || []}
            workspaceDialogues={userOfCustomer?.user?.assignedDialogues?.privateWorkspaceDialogues || []}
            userId={id}
          />
        </UI.ModalBody>
      )}
    </UI.ModalCard>
  );
};
