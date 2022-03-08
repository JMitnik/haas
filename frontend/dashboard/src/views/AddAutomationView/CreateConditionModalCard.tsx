import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { PlusCircle } from 'react-feather';
import { useLazyQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import Select from 'react-select';

import {
  AutomationConditionScopeType,
  ConditionPropertyAggregateType,
  QuestionAspectType,
  QuestionNode,
  QuestionNodeTypeEnum,
  useGetWorkspaceDialoguesQuery,
} from 'types/generated-types';
import { DialogueNodePicker } from 'components/NodePicker/DialogueNodePicker';
import { NodeCell } from 'components/NodeCell';
import { NodePicker } from 'components/NodePicker';
import { useCustomer } from 'providers/CustomerProvider';
import Dropdown from 'components/Dropdown';
import getTopicBuilderQuery from 'queries/getQuestionnaireQuery';

interface NewCTAModalCardProps {
  onClose: () => void;
  onSuccess: (data: ConditionEntry) => void;
}

const schema = yup.object().shape({
  scopeType: yup.string().required(),
  // activeDialogue: yup.string().notRequired(),
});

type TwoDateArray = [Date, Date];

export interface FormDataProps {
  scopeType: string;
  activeDialogue: {
    type: string;
    value: string;
    label: string;
    id: string;
  } | null;
  activeQuestion: {
    type: string;
    value: string;
    label: string;
  } | null,
  aspect?: string;
  questionOption: { label: string, value: string } | null;
  aggregate: string;
  latest: number;
  dateRange: TwoDateArray
}

export interface ActiveQuestion {
  type?: QuestionNodeTypeEnum;
  value?: string;
  label?: string;
}

export interface ConditionEntry {
  scopeType: AutomationConditionScopeType;
  activeDialogue: {
    type: string;
    value: string;
    label: string | undefined;
    id: string;
  } | null;
  activeQuestion: ActiveQuestion | null;
  aspect?: string;
  dateRange: TwoDateArray | null;
  aggregate?: ConditionPropertyAggregateType;
  questionOption?: string;
  latest?: number;
}

export const CreateConditionModalCard = ({ onClose, onSuccess }: NewCTAModalCardProps) => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
      scopeType: 'QUESTION',
      latest: 1,
    },
  });

  const onSubmit = (formData: FormDataProps) => {
    const returnData: ConditionEntry = {
      scopeType: formData.scopeType as AutomationConditionScopeType,
      activeDialogue: formData.activeDialogue,
      activeQuestion: formData.activeQuestion as ActiveQuestion,
      aspect: formData.aspect,
      dateRange: formData.dateRange,
      aggregate: formData.aggregate as ConditionPropertyAggregateType,
      questionOption: formData.questionOption?.value,
      latest: formData.latest,
    };
    console.log('Return data: ', returnData);
    onSuccess(returnData);
    onClose();
  };

  const { data: dialoguesData, loading } = useGetWorkspaceDialoguesQuery({
    variables: {
      customerSlug: activeCustomer?.slug as string,
    },
  });

  const [getQuestions, { data: questionsData }] = useLazyQuery(getTopicBuilderQuery);

  const dialogueItems = dialoguesData?.customer?.dialogues?.map(
    (dialogue) => ({ id: dialogue.id, value: dialogue.slug, label: dialogue.title, type: 'DIALOGUE' }),
  ) || [];

  const questionItems = questionsData?.customer?.dialogue?.questions?.map(
    (question: QuestionNode) => ({
      value: question.id,
      label: question.title,
      type: question.type,
      questionOptions: question.options,
    }),
  ) || [];

  const watchActiveQuestion = useWatch({
    control: form.control,
    name: 'activeQuestion',
    defaultValue: null,
  });

  const questionOptions = watchActiveQuestion
    ? questionItems.find(
      (question: any) => question.value === watchActiveQuestion.value,
    )?.questionOptions?.map(
      (option: any) => ({ label: option.value, value: option.value }),
    ) || []
    : [];

  const watchScopeType = useWatch({
    control: form.control,
    name: 'scopeType',
    defaultValue: 'QUESTION',
  });

  const watchAspectType = useWatch({
    control: form.control,
    name: 'aspect',
    defaultValue: '',
  });

  const watchLatest = useWatch({
    control: form.control,
    name: 'latest',
    defaultValue: 1,
  });

  const watchActiveDialogue = useWatch({
    control: form.control,
    name: 'activeDialogue',
    defaultValue: null,
  });

  useEffect(() => {
    if (watchActiveDialogue) {
      form.setValue('activeQuestion', null);
      getQuestions({
        variables: {
          customerSlug: activeCustomer?.slug,
          dialogueSlug: watchActiveDialogue?.value,
        },
      });
    } else {
      form.setValue('activeQuestion', null);
    }
  }, [watchActiveDialogue]);

  return (
    <UI.ModalCard maxWidth={1000} onClose={onClose}>
      <UI.ModalHead>
        <UI.ViewTitle>{t('automation:add_condition')}</UI.ViewTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        <UI.Div paddingLeft={0} paddingRight="4em">
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
                    <UI.FormControl gridColumn="1 / -1" isRequired isInvalid={!!form.formState.errors.scopeType}>
                      <UI.FormLabel htmlFor="scopeType">{t('automation:scope_type')}</UI.FormLabel>
                      <UI.InputHelper>{t('automation:scope_type_helper')}</UI.InputHelper>
                      <Controller
                        control={form.control}
                        name="scopeType"
                        render={({ field: { onBlur, onChange, value } }) => (
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
                      <UI.ErrorMessage>{form.formState.errors.scopeType?.message}</UI.ErrorMessage>
                    </UI.FormControl>

                    <UI.FormControl isRequired isInvalid={!!form.formState.errors.activeDialogue}>
                      <UI.FormLabel htmlFor="activeDialogue">
                        {t('dialogue')}
                      </UI.FormLabel>
                      <UI.InputHelper>
                        {t(`automation:dialogue_helper_${watchScopeType}`)}
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
                                <UI.Helper>{t('dialogue')}</UI.Helper>
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
                                    render={({ field: { value, onChange } }) => (
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
                                                {t('add_dialogue')}
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

                    <UI.FormControl isRequired isInvalid={!!form.formState.errors.activeDialogue}>
                      <UI.FormLabel htmlFor="questionType">
                        {t('question')}
                      </UI.FormLabel>
                      <UI.InputHelper>
                        {t('automation:question_helper')}
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
                                <UI.Helper>{t('question')}</UI.Helper>
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
                                    name="activeQuestion"
                                    control={form.control}
                                    defaultValue={null}
                                    render={({ field: { value, onChange } }) => (
                                      <Dropdown
                                        isRelative
                                        renderOverlay={({ onClose: onDialoguePickerClose }) => (
                                          <NodePicker
                                            // Handle items (in this case dialogues)
                                            items={questionItems}
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
                                                {t('add_question')}
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

                    {watchScopeType === 'QUESTION' && (
                      <UI.FormControl gridColumn="1 / -1" isRequired isInvalid={!!form.formState.errors.aspect}>
                        <UI.FormLabel htmlFor="aspect">{t('automation:property')}</UI.FormLabel>
                        <UI.InputHelper>{t('automation:property_helper')}</UI.InputHelper>
                        <Controller
                          control={form.control}
                          name="aspect"
                          render={({ field: { onBlur, onChange, value } }) => (
                            <UI.RadioButtons onBlur={onBlur} onChange={onChange} value={value}>
                              <UI.RadioButton
                                value={QuestionAspectType.NodeValue}
                                mr={2}
                                text={(t('automation:node_value'))}
                                description={(t('automation:node_value_helper'))}
                              />
                              <UI.RadioButton
                                isDisabled
                                value={QuestionAspectType.AnswerSpeed}
                                mr={2}
                                text={(t('automation:answer_speed'))}
                                description={(t('automation:answer_speed_helper'))}
                              />
                            </UI.RadioButtons>
                          )}
                        />
                        <UI.ErrorMessage>{form.formState.errors.scopeType?.message}</UI.ErrorMessage>
                      </UI.FormControl>
                    )}

                    {watchAspectType === 'NODE_VALUE' && (
                      // TODO: Add check if selected question is choice or videoembedded before showing this field
                      <UI.FormControl isRequired>
                        <UI.FormLabel htmlFor="questionOption">{t('automation:question_option')}</UI.FormLabel>
                        <Controller
                          name="questionOption"
                          control={form.control}
                          defaultValue={null}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Select
                              placeholder="Select a dialogue"
                              id="questionOption"
                              classNamePrefix="select"
                              className="select"
                              isLoading={loading}
                              defaultOptions
                              options={questionOptions}
                              value={value}
                              onChange={onChange}
                              onBlur={onBlur}
                            />
                          )}
                        />
                      </UI.FormControl>
                    )}

                  </UI.InputGrid>
                </UI.Div>
              </UI.FormSection>
              <UI.FormSection id="aggregate">
                <UI.Div>
                  <UI.H3 color="default.text" fontWeight={500} pb={2}>{t('automation:aggregate')}</UI.H3>
                  <UI.Muted color="gray.600">
                    {t('automation:aggregate_helper')}
                  </UI.Muted>
                </UI.Div>
                <UI.Div>
                  <UI.InputGrid>
                    <UI.FormControl gridColumn="1 / -1" isRequired isInvalid={!!form.formState.errors.scopeType}>
                      <UI.FormLabel htmlFor="aggregate">{t('automation:aggregate_type')}</UI.FormLabel>
                      <UI.InputHelper>{t('automation:aggregate_type_helper')}</UI.InputHelper>
                      <Controller
                        control={form.control}
                        name="aggregate"
                        render={({ field: { onBlur, onChange, value } }) => (
                          <UI.RadioButtons onBlur={onBlur} onChange={onChange} value={value}>
                            <UI.RadioButton
                              value="AVG"
                              mr={2}
                              text={(t('automation:average'))}
                              description={(t('automation:average_helper'))}
                            />
                            <UI.RadioButton
                              value="COUNT"
                              mr={2}
                              text={(t('automation:count'))}
                              description={(t('automation:count_helper'))}
                            />
                          </UI.RadioButtons>
                        )}
                      />
                      <UI.ErrorMessage>{form.formState.errors.scopeType?.message}</UI.ErrorMessage>
                    </UI.FormControl>

                    <UI.FormControl>
                      <UI.FormLabel>{t('automation:date_range')}</UI.FormLabel>
                      <UI.FormLabelHelper>{t('automation:date_range_helper')}</UI.FormLabelHelper>
                      <UI.Div>
                        <Controller
                          name="dateRange"
                          control={form.control}
                          render={({ field: { onChange, value } }) => (
                            <UI.DatePicker
                              value={value}
                              format="DD-MM-YYYY HH:mm"
                              onChange={onChange}
                              range
                            />
                          )}
                        />
                      </UI.Div>
                    </UI.FormControl>

                    <UI.FormControl isRequired isInvalid={!!form.formState.errors.latest}>
                      <UI.FormLabel htmlFor="latest">
                        {t('automation:latest')}
                      </UI.FormLabel>
                      <UI.InputHelper>
                        {t('automation:latest_helper')}
                      </UI.InputHelper>
                      <UI.Div position="relative" pb={3}>
                        <Controller
                          control={form.control}
                          name="latest"
                          render={({ field: { onChange, value } }) => (
                            <UI.FormSlider
                              onChange={onChange}
                              defaultValue={value}
                              // isDisabled
                              stepSize={1}
                              min={1}
                              max={100}
                            />
                          )}
                        />
                        <UI.ErrorMessage>{form.formState.errors.latest?.message}</UI.ErrorMessage>
                        <UI.Div position="absolute" bottom={0} left={0}>1</UI.Div>
                        <UI.Div position="absolute" bottom={0} right={-7.5}>100</UI.Div>

                      </UI.Div>
                      <UI.Flex
                        mt="1em"
                        width="fit-content"
                        color="#1890ff"
                        border="1px solid #1890ff"
                        borderRadius="6px"
                        padding="0.5em"
                        backgroundColor="#D3EEFF"
                        alignItems="center"
                      >
                        <UI.Div mr={1} style={{ fontWeight: 'bold', fontSize: '1.3em' }}>#</UI.Div>
                        <UI.Flex>
                          <UI.Div mr={1}>Latest</UI.Div>
                          <UI.Div mr={1}>{watchLatest}</UI.Div>
                          <UI.Div mr={1}>{watchLatest === 1 ? 'entry' : 'entries'}</UI.Div>
                          <UI.Div>will be aggregated</UI.Div>
                        </UI.Flex>

                      </UI.Flex>
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
