import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { FileText, HardDrive, Mail, PlusCircle, Smartphone } from 'react-feather';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';

import {
  AutomationActionType, Customer, Maybe, RoleType, UserType, useGetUsersAndRolesQuery,
} from 'types/generated-types';
import { TargetTypeEnum, UserNodePicker } from 'components/NodePicker/UserNodePicker';
import Dropdown from 'components/Dropdown';

import { TargetCell } from './TargetCell';

interface NewActionModalCardProps {
  onClose: () => void;
  onCreate: (data: any) => void;
  onUpdate: (data: any) => void;
  action?: () => ActionEntry | undefined;
}

const schema = yup.object().shape({
  type: yup.string().required(),
  targets: yup.array().of(
    yup.object().shape({
      target: yup.object().shape({
        type: yup.string(),
        value: yup.string(),
        label: yup.string(),
      }),
    }),
  ),
});

export interface TargetEntry {
  type: string;
  value: string;
  label: string;
}

export interface ActionEntry {
  type: AutomationActionType;
  targets?: {
    target?: TargetEntry;
  }[];
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

export const CreateActionModalCard = ({ onClose, onCreate, onUpdate, action }: NewActionModalCardProps) => {
  const { t } = useTranslation();
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const activeAction = action?.();
  const form = useForm<ActionEntry>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
      type: activeAction?.type || AutomationActionType.GenerateReport,
      targets: activeAction?.targets || [{}],
    },
  });

  const { data } = useGetUsersAndRolesQuery({
    variables: {
      customerSlug,
    },
  });

  const onSubmit = () => {
    const formData = form.getValues();
    if (activeAction) {
      onUpdate(formData);
    } else {
      onCreate(formData);
    }

    onClose();
  };

  const watchActionType = useWatch({
    control: form.control,
    name: 'type',
    defaultValue: activeAction?.type,
  });

  const { fields: targetFields, append, remove } = useFieldArray({
    name: 'targets',
    control: form.control,
    keyName: 'arrayKey',
  });

  const userPickerEntries = mapToUserPickerEntries(data?.customer);

  return (
    <UI.ModalCard maxWidth={1000} onClose={onClose}>
      <UI.ModalHead>
        <UI.ViewTitle>{activeAction ? t('automation:edit_action') : t('automation:add_action')}</UI.ViewTitle>
      </UI.ModalHead>
      <UI.ModalBody style={{ padding: 0 }}>
        <UI.Div paddingLeft={0}>
          <UI.Form>
            <UI.Div>
              <UI.FormSection id="general">
                <UI.Div gridColumn="1 / -1">
                  <UI.InputGrid>
                    <UI.FormControl isRequired isInvalid={!!form.formState.errors.type}>
                      <UI.FormLabel htmlFor="scopeType">{t('automation:action_type')}</UI.FormLabel>
                      <UI.InputHelper>{t('automation:action_type_helper')}</UI.InputHelper>
                      <Controller
                        control={form.control}
                        name="type"
                        render={({ field: { onBlur, onChange, value } }) => (
                          <UI.RadioButtons onBlur={onBlur} onChange={onChange} value={value}>
                            <UI.RadioButton
                              value={AutomationActionType.GenerateReport}
                              mr={2}
                              text={(t('automation:generate_report'))}
                              description={t('automation:generate_report_helper')}
                              icon={FileText}
                            />
                            <UI.RadioButton
                              value={AutomationActionType.SendEmail}
                              mr={2}
                              text={(t('automation:send_email'))}
                              description={t('automation:send_email_helper')}
                              icon={Mail}
                            />
                            <UI.RadioButton
                              isDisabled
                              value={AutomationActionType.SendSms}
                              mr={2}
                              text={(t('automation:send_sms'))}
                              description={t('automation:send_sms_helper')}
                              icon={Smartphone}
                            />
                            <UI.RadioButton
                              isDisabled
                              value={AutomationActionType.ApiCall}
                              mr={2}
                              text={(t('automation:api_call'))}
                              description={t('automation:api_call_helper')}
                              icon={HardDrive}
                            />
                          </UI.RadioButtons>
                        )}
                      />
                      <UI.ErrorMessage>{form.formState.errors.type?.message}</UI.ErrorMessage>
                    </UI.FormControl>

                    <UI.FormControl isRequired>
                      <UI.FormLabel htmlFor="activeDialogue">
                        {t('automation:targets')}
                      </UI.FormLabel>
                      <UI.InputHelper>
                        {t(`automation:target_helper_${watchActionType}`)}
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

                                <UI.Helper>{t('automation:target')}</UI.Helper>
                              </UI.Grid>
                              {targetFields.map((target, index) => (
                                <UI.Grid
                                  key={target.arrayKey}
                                  pt={2}
                                  pb={2}
                                  pl={0}
                                  pr={0}
                                  borderBottom="1px solid #edf2f7"
                                  gridTemplateColumns="1fr"
                                >
                                  <UI.Div alignItems="center" display="flex">
                                    <Controller
                                      name={`targets.${index}.target`}
                                      control={form.control}
                                      defaultValue={undefined}
                                      render={({ field: { value, onChange } }) => (
                                        <Dropdown
                                          isRelative
                                          renderOverlay={({ onClose: onDialoguePickerClose }) => (
                                            <UserNodePicker
                                              // Handle items (in this case dialogues)
                                              items={userPickerEntries}
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
                                              {value?.value ? (
                                                <TargetCell
                                                  onRemove={() => {
                                                    if (targetFields.length > 1) {
                                                      remove(index);
                                                    } else {
                                                      onChange(null);
                                                    }
                                                  }}
                                                  onClick={onOpen}
                                                  node={value}
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
                              ))}
                              <UI.Div mt={4}>
                                <UI.Button
                                  variantColor="gray"
                                  onClick={
                                    () => append({})
                                  }
                                >
                                  <UI.Icon mr={1}>
                                    <PlusCircle />
                                  </UI.Icon>
                                  {t('add_target')}
                                </UI.Button>
                              </UI.Div>
                            </>
                          </UI.Div>
                        </UI.Flex>
                      </UI.Div>
                    </UI.FormControl>

                    <UI.Flex justifyContent="flex-end">
                      <UI.Button
                        style={{ marginRight: '0.5em' }}
                        variant="outline"
                        onClick={() => onClose()}
                      >
                        Cancel

                      </UI.Button>
                      <UI.Button
                        // isLoading={createLoading || updateLoading}
                        isDisabled={!form.formState.isValid}
                        variantColor="teal"
                        onClick={() => onSubmit()}
                      >
                        {activeAction ? t('update') : t('save')}
                      </UI.Button>

                    </UI.Flex>
                  </UI.InputGrid>
                </UI.Div>
              </UI.FormSection>
            </UI.Div>
          </UI.Form>
        </UI.Div>
      </UI.ModalBody>
    </UI.ModalCard>
  );
};
