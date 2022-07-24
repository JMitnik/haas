import * as UI from '@haas/ui';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { Dialogue, useAssignUserToDialoguesMutation } from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';
import { useToast } from 'hooks/useToast';

interface AssignDialoguePickerProps {
  assignedDialogues: ({
    __typename?: 'Dialogue' | undefined;
  } & Pick<Dialogue, 'id' | 'slug'>)[];
  workspaceDialogues: { id: string, title: string, slug: string, description: string }[];
  onClose: () => void;
  userId: string;
}

export const AssignDialoguePicker = ({
  assignedDialogues,
  workspaceDialogues,
  onClose,
  userId,
}: AssignDialoguePickerProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { activeCustomer } = useCustomer();

  const [assignUserToDialogues, { loading }] = useAssignUserToDialoguesMutation({
    onCompleted: () => {
      onClose();
      toast.success({ description: t('toast:updated_assigned_dialogues_helper') });
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

    assignUserToDialogues({
      variables: {
        input: {
          assignedDialogueIds: filteredDialogues,
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
      <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}>
        {workspaceDialogues?.map((dialogue) => (
          <Controller
            control={control}
            name={dialogue.id}
            defaultValue={assignedDialogueIds?.includes(dialogue.id) || false}
            key={dialogue.id}
            render={({ onChange, value }) => (
              <UI.CheckboxCard
                value={value}
                key={dialogue.id}
                onChange={onChange}
                description={dialogue.description}
                title={dialogue.title}
              />
            )}
          />
        ))}

        {!workspaceDialogues?.length && (
          <UI.Flex gridColumn="1/-1" justifyContent="center">
            {t('no_private_dialogue_message')}
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
