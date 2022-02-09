import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { PlusCircle } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';

import { DialogueNodePicker } from 'components/NodePicker/DialogueNodePicker';
import { NodeCell } from 'components/NodeCell';
import { QuestionNodeTypeEnum } from 'types/generated-types';
import { stopPropagate } from 'views/ActionsOverview/CTAForm';
import Dropdown from 'components/Dropdown';

interface NewCTAModalCardProps {
  onClose: () => void;
  onSuccess: (data?: any) => void;
}

const schema = yup.object().shape({
  scopeType: yup.string().required(),
  // activeDialogue: yup.string().notRequired(),
});

export interface FormDataProps {
  scopeType: string;
  activeDialogue: {
    title: string;
    id: string;
  };
}

export const CreateConditionModalCard = ({ onClose, onSuccess }: NewCTAModalCardProps) => {
  const { t } = useTranslation();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
      scopeType: 'QUESTION',
    },
  });

  const onSubmit = (formData: FormDataProps) => {
    console.log('Form data: ', formData);
  };

  // TODO: Replace with query fetching all dialogues
  const dialogueItems = [{ value: '0x324324234', label: 'Dialogue#1', type: QuestionNodeTypeEnum.Form }];

  return (
    <UI.ModalCard maxWidth={1200} onClose={onClose}>
      <UI.ModalHead>
        <UI.ViewTitle>{t('views:add_dialogue_view')}</UI.ViewTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        <UI.FormContainer expandedForm>
          <UI.Form onSubmit={stopPropagate(form.handleSubmit(onSubmit))}>
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
                    <UI.FormControl gridColumn="1 / -1" isRequired isInvalid={!!form.errors.scopeType}>
                      <UI.FormLabel htmlFor="scopeType">{t('automation:scope_type')}</UI.FormLabel>
                      <UI.InputHelper>{t('automation:scope_type_helper')}</UI.InputHelper>
                      <Controller
                        control={form.control}
                        name="scopeType"
                        render={({ onBlur, onChange, value }) => (
                          <UI.RadioButtons onBlur={onBlur} onChange={onChange} value={value}>
                            <UI.RadioButton
                              value="QUESTION"
                              mr={2}
                              text={(t('question'))}
                            />
                            <UI.RadioButton
                              isDisabled
                              value="DIALOGUE"
                              mr={2}
                              text={(t('dialogue'))}

                            />
                            <UI.RadioButton
                              isDisabled
                              value="WORKSPACE"
                              mr={2}
                              text={(t('workspace'))}
                            />
                          </UI.RadioButtons>
                        )}
                      />
                      <UI.ErrorMessage>{form.errors.scopeType?.message}</UI.ErrorMessage>
                    </UI.FormControl>

                    <UI.FormControl isInvalid={!!form.errors.activeDialogue}>
                      <UI.FormLabel htmlFor="questionType">
                        {t('call_to_action')}
                      </UI.FormLabel>
                      <UI.InputHelper>
                        {t('dialogue:cta_helper')}
                      </UI.InputHelper>
                      <UI.Div>
                        <UI.Flex>
                          {/* TODO: Make a theme out of it */}
                          <UI.Div
                            width="100%"
                            backgroundColor="#fbfcff"
                            border="1px solid #edf2f7"
                            borderRadius="10px"
                            padding={4}
                          >
                            <>
                              <UI.Grid gridTemplateColumns="2fr 1fr">
                                <UI.Helper>{t('call_to_action')}</UI.Helper>
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
                                    name="activeDialogue"
                                    control={form.control}
                                    defaultValue={null}
                                    render={({ value, onChange }) => (
                                      <Dropdown
                                        isRelative
                                        renderOverlay={({ onClose: onDialoguePickerClose }) => (
                                          <DialogueNodePicker
                                            // Handle items (in this case dialogues)
                                            items={dialogueItems}
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
                                            {value?.label ? (
                                              <NodeCell onRemove={() => onChange(null)} onClick={onOpen} node={value} />
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
                                                {t('add_call_to_action')}
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

                  </UI.InputGrid>
                </UI.Div>
              </UI.FormSection>
            </UI.Div>
          </UI.Form>
        </UI.FormContainer>
      </UI.ModalBody>
    </UI.ModalCard>
  );
};
