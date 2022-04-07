import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { Controller, useForm } from 'react-hook-form';
import { useAssignUserToDialoguesMutation, useGetUserCustomerFromCustomerQuery } from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';
import { useToast } from '@chakra-ui/core';
import styled, { css } from 'styled-components';

interface UserModalCardProps {
  id: string;
  onClose: () => void;
}

interface PrivateDialoguesUserFormProps {
  assignedDialogueIds: string[];
  workspaceDialogues: { id: string, title: string, slug: string, description: string }[];
  onClose: () => void;
  userId: string;
}

const CheckBoxCard = styled(UI.Card) <{ isChecked?: boolean }>`
  ${({ theme, isChecked }) => css`
    width: 100%;
    min-height: 100px;
    border: 1px solid #F9F6EE;

    ${isChecked && css`
      border: 1px solid ${theme.colors.blue[500]};
    `}
  `}
`;

const PrivateDialoguesUserForm = ({
  assignedDialogueIds,
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
      assignedDialogueIds,
    },
  });

  const onSubmit = (data: any) => {
    console.log('DATA: ', data);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <UI.Grid paddingLeft={1} paddingRight={1} gridTemplateColumns="1fr 1fr">
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
                  borderBottomColor="gray.100"
                  py={1}
                  px={1}
                >
                  <UI.Helper>
                    {dialogue.title}
                  </UI.Helper>
                  <UI.Checkbox
                    // Without stopPropagation, checkbox and checkboxcard cancel each other out
                    onClick={(e) => e.stopPropagation()}
                    isChecked={value}
                    onChange={() => onChange(!value)}
                  />
                </UI.Flex>
                <UI.Text px={1} py={1}>{dialogue.description}</UI.Text>
              </CheckBoxCard>

            )}
          />
        ))}
      </UI.Grid>

      <UI.Flex justifyContent="flex-end" pt={2} pr={2}>
        <UI.Button isLoading={loading} variantColor="teal" type="submit">
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
  const { data, loading, error } = useGetUserCustomerFromCustomerQuery({
    variables: {
      id: activeCustomer?.id || '',
      userId: id,
    },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return <UI.Loader />;
  }

  const userOfCustomer = data?.customer?.userCustomer;

  console.log('userOfCustomer: ', userOfCustomer);

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

          </>
        )}
        <UI.Hr />
        <UI.ModalHead style={{ borderBottom: 'none', paddingBottom: '1em' }}>
          <UI.ModalTitle>{t('assigned_dialogues')}</UI.ModalTitle>
        </UI.ModalHead>
        <PrivateDialoguesUserForm
          onClose={onClose}
          assignedDialogueIds={userOfCustomer?.user.privateDialogues?.assignedDialogueIds || []}
          workspaceDialogues={userOfCustomer?.user.privateDialogues?.workspaceDialogues || []}
          userId={id}
        />
      </UI.ModalBody>
    </UI.ModalCard>
  );
};
