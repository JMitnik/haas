import * as UI from '@haas/ui';
import { Controller } from 'react-hook-form';
import {
  PlusCircle,
} from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { Customer, Maybe, RoleType, UserType, useGetUsersAndRolesQuery } from 'types/generated-types';
import { TargetTypeEnum, UserNodePicker } from 'components/NodePicker/UserNodePicker';
import { useNavigator } from 'hooks/useNavigator';
import Dropdown from 'components/Dropdown/Dropdown';

import { ContactsCell } from './ContactsCell';

interface FormNodeContactsFragmentProps {
  form: any;
  contacts: any;
}

interface TargetEntry {
  label: string;
  value: string;
  type: TargetTypeEnum;
}

const mapToUserPickerEntries = (customer: Maybe<{
  __typename?: 'Customer' | undefined;
} & Pick<Customer, 'id'> & {
  users?: Maybe<({
    __typename?: 'UserType' | undefined;
  } & Pick<UserType, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'> & {
    role?: Maybe<{
      __typename?: 'RoleType' | undefined;
    } & Pick<RoleType, 'id' | 'name'>> | undefined;
  })[]> | undefined;
  roles?: Maybe<({
    __typename?: 'RoleType' | undefined;
  } & Pick<RoleType, 'id' | 'name'>)[]> | undefined;
}> | undefined) => {
  const userPickerEntries: TargetEntry[] = [];

  customer?.roles?.forEach((role) => {
    userPickerEntries.push({
      label: role.name,
      value: role.id,
      type: TargetTypeEnum.Role,
    });
  });

  customer?.users?.forEach((user) => {
    userPickerEntries.push({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
      type: TargetTypeEnum.User,
    });
  });

  return userPickerEntries;
};

const FormNodeContactsFragment = ({ form, contacts }: FormNodeContactsFragmentProps) => {
  const { t } = useTranslation();
  const { customerSlug } = useNavigator();

  const { data } = useGetUsersAndRolesQuery({
    variables: {
      customerSlug,
    },
  });

  const userPickerEntries = mapToUserPickerEntries(data?.customer);

  return (
    <UI.FormControl isRequired style={{ overflowX: 'scroll' }}>
      <UI.FormLabel htmlFor="activeDialogue">
        {t('contacts')}
      </UI.FormLabel>
      <UI.InputHelper>
        {t('contacts_helper')}
      </UI.InputHelper>
      <UI.Div>
        <UI.Flex>
          <UI.Div
            width="100%"
            backgroundColor="#fbfcff"
            border="1px solid #edf2f7"
            borderRadius="10px"
            padding={2}
          >
            <>
              <UI.Grid m={2} ml={0} gridTemplateColumns="1fr">
                <UI.Helper>{t('contact')}</UI.Helper>
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
                    name="contact.contacts"
                    control={form.control}
                    render={({ field: { value, onChange } }) => (
                      <Dropdown
                        isRelative
                        renderOverlay={({ onClose: onUserPickerClose }) => (
                          <UserNodePicker
                            currValues={contacts}
                            isMulti
                            items={userPickerEntries}
                            onClose={onUserPickerClose}
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
                                users={value}
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
            </>
          </UI.Div>
        </UI.Flex>
      </UI.Div>
    </UI.FormControl>
  );
};

export default FormNodeContactsFragment;
