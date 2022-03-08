import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { FileText, HardDrive, Mail, PlusCircle, Smartphone } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';

import {
  AutomationActionType, Customer, Maybe, RoleType, UserType, useGetUsersAndRolesQuery,
} from 'types/generated-types';
import { TargetTypeEnum, UserNodePicker } from 'components/NodePicker/UserNodePicker';
import Dropdown from 'components/Dropdown';

import { ConditionCell } from './ConditionCell';
import { DialogueNodePicker } from 'components/NodePicker/DialogueNodePicker';
import { NodeCell } from 'components/NodeCell';
import { useCustomer } from 'providers/CustomerProvider';
import { useParams } from 'react-router';

interface NewActionModalCardProps {
  onClose: () => void;
  onSuccess: (data: any) => void;
}

const schema = yup.object().shape({
  actionType: yup.string().required(),
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

export interface FormDataProps {
  actionType: AutomationActionType;
  targets: {
    target: TargetEntry;
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

export const CreateActionModalCard = ({ onClose, onSuccess }: NewActionModalCardProps) => {
  const { t } = useTranslation();
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
      actionType: AutomationActionType.GenerateReport,
      targets: [{}],
    },
  });

  // TODO: Query to fetch all roles
  // TODO: Query all users
  const { data } = useGetUsersAndRolesQuery({
    variables: {
      customerSlug,
    },
  });

  const onSubmit = (formData: FormDataProps) => {
    console.log('Form data: ', formData);
    // onSuccess(returnData);
    // onClose();
  };

  const watchActionType = useWatch({
    control: form.control,
    name: 'actionType',
    defaultValue: AutomationActionType.GenerateReport,
  });

  const { fields: targetFields, append } = useFieldArray({
    name: 'targets',
    control: form.control,
    keyName: 'arrayKey',
  });

  const userPickerEntries = mapToUserPickerEntries(data?.customer);

  return (
    <UI.ModalCard maxWidth={1000} onClose={onClose}>
      <UI.ModalHead>
        <UI.ViewTitle>{t('automation:add_action')}</UI.ViewTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        <UI.Div paddingLeft={0}>
          <UI.Form onSubmit={form.handleSubmit(onSubmit)}>
            <UI.Div>
              <UI.FormSection id="general">
                <UI.Div>
                  <UI.H3 color="default.text" fontWeight={500} pb={2}>{t('automation:scope')}</UI.H3>
                  <UI.Muted color="gray.600">
                    {t('automation:scope_helper')}
                  </UI.Muted>
                </UI.Div>
                <UI.Div>
                  <UI.InputGrid>
                    <UI.FormControl isRequired isInvalid={!!form.formState.errors.actionType}>
                      <UI.FormLabel htmlFor="scopeType">{t('automation:action_type')}</UI.FormLabel>
                      <UI.InputHelper>{t('automation:action_type_helper')}</UI.InputHelper>
                      <Controller
                        control={form.control}
                        name="actionType"
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
                              isDisabled
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
                      <UI.ErrorMessage>{form.formState.errors.actionType?.message}</UI.ErrorMessage>
                    </UI.FormControl>

                    <UI.FormControl isRequired>
                      <UI.FormLabel htmlFor="activeDialogue">
                        {t('dialogue')}
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
                            padding={4}
                            paddingLeft={0}
                            paddingRight={0}
                          >
                            <>
                              <UI.Grid m={2} gridTemplateColumns="1.2fr 4fr 1.2fr 2fr auto">

                                <UI.Helper>{t('automation:logic')}</UI.Helper>
                                <UI.Helper>{t('automation:condition')}</UI.Helper>
                                <UI.Helper>{t('automation:operator')}</UI.Helper>
                                <UI.Helper>{t('automation:compare_to')}</UI.Helper>
                              </UI.Grid>
                              {targetFields.map((target, index) => (
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
                                              {value?.value /* TODO: CHange this */ ? (
                                                <NodeCell
                                                  onRemove={() => onChange(null)}
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
                              <UI.Div ml={4} mt={4}>
                                <UI.Button
                                  variantColor="gray"
                                  onClick={
                                    () => append({})
                                  }
                                >
                                  <UI.Icon mr={1}>
                                    <PlusCircle />
                                  </UI.Icon>
                                  {t('add_choice')}
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
                        type="submit"
                      >
                        {t('save')}
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
