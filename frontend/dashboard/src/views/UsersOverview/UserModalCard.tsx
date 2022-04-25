import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { Controller, useForm } from 'react-hook-form';
import { Dialogue, useAssignUserToDialoguesMutation, useGetUserCustomerFromCustomerQuery } from 'types/generated-types';
import { Mail } from 'react-feather';
import { useCustomer } from 'providers/CustomerProvider';
import { useToast } from '@chakra-ui/core';
import styled, { css } from 'styled-components';
import useAuth from 'hooks/useAuth';

interface UserModalCardProps {
  id: string;
  onClose: () => void;
}

interface PrivateDialoguesUserFormProps {
  assignedDialogues: ({
    __typename?: 'Dialogue' | undefined;
  } & Pick<Dialogue, 'id' | 'slug'>)[];
  workspaceDialogues: { id: string, title: string, slug: string, description: string }[];
  onClose: () => void;
  userId: string;
}

const CheckBoxCard = styled(UI.Card) <{ isChecked?: boolean }>`
  ${({ theme, isChecked }) => css`
    width: 100%;
    min-height: 100px;
    border: 1px solid transparent;
    padding: 0;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover {
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 6px 0px, rgba(0, 0, 0, 0.06) 0px 1px 5px 0px;
    }

    ${isChecked && css`
      border: 2px solid ${theme.colors.off[500]};
    `}
  `}
`;

const PrivateDialoguesUserForm = ({
  assignedDialogues,
  workspaceDialogues,
  onClose,
  userId,
}: PrivateDialoguesUserFormProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { activeCustomer } = useCustomer();

  const [assignUserToDialogues, { loading }] = useAssignUserToDialoguesMutation({
    onCompleted: () => {
      onClose();
      toast({
        title: t('toast:updated_assigned_dialogues'),
        description: t('toast:updated_assigned_dialogues_helper'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

  const { handleSubmit, control } = useForm({
    defaultValues: {
      workspaceDialogues,
      assignedDialogues,
    },
  });

  const onSubmit = (data: any) => {
    const filteredDialogues = Object.entries(data).filter((entry) => entry[1] === true).map((entry) => entry[0]);
    const notAssignDialogues = Object.entries(data).filter((entry) => entry[1] === false).map((entry) => entry[0]);

    assignUserToDialogues({
      variables: {
        input: {
          assignedDialogueIds: filteredDialogues,
          delistedDialogueIds: notAssignDialogues,
          userId,
          workspaceId: activeCustomer?.id as string,
        },
      },
    });
  };

  const assignedDialogueIds = assignedDialogues.map(
    (dialogue) => dialogue.id,
  ) || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <UI.Grid gridTemplateColumns="1fr">
        {workspaceDialogues?.map((dialogue) => (
          <Controller
            control={control}
            name={dialogue.id}
            defaultValue={assignedDialogueIds?.includes(dialogue.id) || false}
            key={dialogue.id}
            render={({ onChange, value }) => (
              <CheckBoxCard
                isChecked={value}
                padding={1}
                onClick={() => onChange(!value)}
              >
                <UI.Flex
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom="1px solid"
                  backgroundColor="neutral.100"
                  borderRadius="10px 10px 0 0"
                  borderBottomColor="gray.100"
                  py={2}
                  px={2}
                >
                  <UI.Helper>
                    {dialogue.title}
                  </UI.Helper>
                  <UI.Checkbox
                    // Without stopPropagation, checkbox and checkboxcard cancel each other out
                    onClick={(e) => e.stopPropagation()}
                    isChecked={value}
                    onChange={() => onChange(!value)}
                    ml={1}
                    variantColor="main"
                  />
                </UI.Flex>
                <UI.Text px={2} py={1}>{dialogue.description}</UI.Text>
              </CheckBoxCard>
            )}
          />
        ))}

        {!workspaceDialogues?.length && (
          <UI.Flex gridColumn="1/-1" justifyContent="center">
            No private dialogues available in this workspace...
          </UI.Flex>
        )}
      </UI.Grid>

      <UI.Flex mt={4} justifyContent="flex-end" pt={2} pr={2}>
        <UI.Button isLoading={loading} isDisabled={!workspaceDialogues?.length} variantColor="main" type="submit">
          {t('save')}
        </UI.Button>
      </UI.Flex>
    </form>
  );
};

/**
 * A modal used to display information of a user after it being clicked on in the UsersOverview
 * @param object with an unique identifier as well as a onClose function to close the modal
 * @returns a pop-up modal displaying User specific information
 */
export const UserModalCard = ({ id, onClose }: UserModalCardProps) => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();
  const { canAssignUsersToDialogue } = useAuth();
  const { data, loading, error } = useGetUserCustomerFromCustomerQuery({
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

  if (loading) {
    return <UI.Loader />;
  }

  const userOfCustomer = data?.customer?.userCustomer;

  return (
    <UI.ModalCard onClose={onClose} breakout>
      {/* <UI.ModalHead>
        <UI.ModalTitle>{t('details')}</UI.ModalTitle>
      </UI.ModalHead> */}

      {error && (
        <UI.ErrorPane header="Server Error" text={error.message} />
      )}
      <UI.Div p={36} bg="neutral.100" borderRadius="10px 10px 0 0">
        <UI.H3 mb={2} fontWeight={600} color="main.500">
          {userOfCustomer?.user.firstName}
          {' '}
          {userOfCustomer?.user.lastName}
        </UI.H3>
        {userOfCustomer && (
          <UI.Stack mb={4}>
            <UI.Grid gridTemplateColumns="auto 1fr" gridColumnGap={4} gridRowGap={2}>
              <UI.Div>
                <UI.FieldLabel>{t('first_name')}</UI.FieldLabel>
              </UI.Div>
              <UI.Div>
                {userOfCustomer?.user?.firstName || 'None'}
              </UI.Div>

              <UI.Div>
                <UI.FieldLabel>{t('last_name')}</UI.FieldLabel>
              </UI.Div>

              <UI.Div>
                {userOfCustomer?.user?.lastName || 'None'}
              </UI.Div>

              <UI.Div>
                <UI.FieldLabel>
                  {t('email')}
                </UI.FieldLabel>
              </UI.Div>

              <UI.Div>
                {userOfCustomer?.user?.email}
              </UI.Div>

              {userOfCustomer?.user?.phone && (
                <>
                  <UI.Div>
                    <UI.FieldLabel>{t('phone')}</UI.FieldLabel>
                  </UI.Div>

                  <UI.Div>
                    {userOfCustomer.user.phone}
                  </UI.Div>
                </>
              )}

              <UI.Div>
                <UI.FieldLabel>{t('role')}</UI.FieldLabel>
              </UI.Div>

              <UI.Div>
                {userOfCustomer?.role?.name}
              </UI.Div>
            </UI.Grid>
            {/* <UI.Div>
                <UI.Helper mb={1}>{t('last_name')}</UI.Helper>
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
              </UI.Div> */}
          </UI.Stack>
        )}
      </UI.Div>
      {canAssignUsersToDialogue && (
        <UI.Div p={36} style={{ boxShadow: 'rgb(0 0 0 / 6%) 0px 1px 4px 0px inset' }}>
          <UI.Span color="off.500" fontWeight={600} mb={2} fontSize="1.1rem" display="inline-block">
            {t('assigned_dialogues')}
          </UI.Span>
          <PrivateDialoguesUserForm
            onClose={onClose}
            assignedDialogues={userOfCustomer?.user.privateDialogues?.assignedDialogues || []}
            workspaceDialogues={userOfCustomer?.user.privateDialogues?.privateWorkspaceDialogues || []}
            userId={id}
          />
        </UI.Div>
      )}
    </UI.ModalCard>
  );
};
