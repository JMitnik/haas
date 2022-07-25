import * as UI from '@haas/ui';
import { Controller, useFormContext } from 'react-hook-form';
import { PlusCircle } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { ContactsCell } from 'views/ActionsOverview/ContactsCell';
import { UserNodePicker } from 'components/NodePicker/UserNodePicker';
import Dropdown from 'components/Dropdown';

import { TargetEntry } from './CreateActionModalCard';

interface RecipientFragmentProps {
  recipientEntries: TargetEntry[];
}

export const RecipientsFragment = ({ recipientEntries }: RecipientFragmentProps) => {
  const { t } = useTranslation();
  const form = useFormContext();

  return (
    <UI.FormSection id="actions">
      <UI.Div>
        <UI.H3 color="default.text" fontWeight={500} pb={2}>{t('automation:recipients')}</UI.H3>
        <UI.Muted color="gray.600">
          {t('automation:recipients_helper')}
        </UI.Muted>
      </UI.Div>
      <UI.Div
        width="100%"
        backgroundColor="#fbfcff"
        border="1px solid #edf2f7"
        borderRadius="10px"
        padding={2}
      >
        <UI.Grid m={2} ml={0} gridTemplateColumns="1fr">
          <UI.Helper>{t('automation:recipient')}</UI.Helper>
        </UI.Grid>
        <UI.Grid
          pt={2}
          pb={2}
          pl={0}
          pr={0}
          borderBottom="1px solid #edf2f7"
          gridTemplateColumns="1fr"
        >
          <UI.Div alignItems="center" display="flex">
            <Controller
              name={`actions.${0}.action.targets`}
              control={form.control}
              defaultValue={undefined}
              render={({ field: { value, onChange } }) => (
                <Dropdown
                  isRelative
                  renderOverlay={({ onClose: onDialoguePickerClose }) => (
                    <UserNodePicker
                      items={recipientEntries}
                      isMulti
                      onClose={onDialoguePickerClose}
                      onChange={onChange}
                    />
                  )}
                >
                  {({ onOpen }) => (
                    <UI.Div
                      width="100%"
                      justifyContent="center"
                      display="flex"
                      alignItems="center"
                    >
                      {value?.length ? (
                        <ContactsCell
                          onRemove={() => {
                            onChange(null);
                          }}
                          onClick={onOpen}
                          users={value as any}
                        />
                      ) : (
                        <UI.Button
                          size="sm"
                          variant="outline"
                          onClick={onOpen}
                          variantColor="altGray"
                        >
                          <UI.Icon mr={1}>
                            <PlusCircle />
                          </UI.Icon>
                          {t('automation:add_target')}
                        </UI.Button>
                      )}
                    </UI.Div>
                  )}
                </Dropdown>
              )}
            />
          </UI.Div>
        </UI.Grid>
      </UI.Div>
    </UI.FormSection>
  );
};
