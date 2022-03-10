import * as UI from '@haas/ui';
import * as yup from 'yup';
import {
  Button, ButtonGroup, FormErrorMessage, Popover, PopoverArrow,
  PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast,
} from '@chakra-ui/core';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { List, PlusCircle, Sliders, Trash, Youtube } from 'react-feather';
import { gql, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import {
  Div, FormControl, FormLabel,
  InputGrid, InputHelper,
} from '@haas/ui';
import { NodeCell } from 'components/NodeCell';
import { NodePicker } from 'components/NodePicker';
import { QuestionNodeTypeEnum } from 'types/generated-types';
import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import { useCustomer } from 'providers/CustomerProvider';
import { useNavigator } from 'hooks/useNavigator';
import Dropdown from 'components/Dropdown';
import updateQuestionMutation from 'mutations/updateQuestion';

import {
  CTANode,
  EdgeConditionProps,
  MappedQuestionOptionProps,
  OverrideLeafProps, QuestionEntryProps,
} from '../../DialogueBuilderInterfaces';
import { ChoiceNodeForm } from './ChoiceNodeForm';
import SliderNodeForm from './SliderNodeForm';

interface SliderNodeMarkerProps {
  id: string;
  label: string;
  subLabel: string;
  range: {
    start?: number;
    end?: number;
  };
}

interface FormDataProps {
  title: string;
  minValue: string;
  maxValue: string;
  videoEmbedded: string;
  questionType: string;
  conditionType: string;
  matchText: string;
  activeLeaf: string;
  overrideLeaf?: { label: string, value: string, type: string } | null;
  parentQuestionType: string;
  sliderNode: {
    id: string;
    markers: SliderNodeMarkerProps[];
  };
  options: string[];
  optionsFull: any[];
  unhappyText: string;
  happyText: string;
  useCustomerSatisfactionTexts: number;
  range: number[];
}

const isVideoEmbeddedType = (questionType: string) => questionType === QuestionNodeTypeEnum.VideoEmbedded;

const isChoiceType = (questionType: string) => {
  if (questionType === 'CHOICE') {
    return true;
  }
  return false;
};

const schema = yup.object().shape({
  title: yup.string().required(),
  questionType: yup.string().required(),
  conditionType: yup.string().notRequired(),
  videoEmbedded: yup.string().when(['questionType'], {
    is: (questionType: string) => questionType === 'VIDEO_EMBEDDED',
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  matchText: yup.string().when(['parentQuestionType'], {
    is: (parentQuestionType: string) => parentQuestionType === 'Choice',
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  optionsFull: yup.array().when(['questionType'], {
    is: (questionType: string) => isChoiceType(questionType) || isVideoEmbeddedType(questionType),
    then: yup.array().min(1).of(yup.object({
      value: yup.string().required('form.value_required'),
    })),
    otherwise: yup.array().notRequired(),
  }),
});

interface QuestionEntryFormProps {
  onAddExpandChange?: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  title: string;
  overrideLeaf?: OverrideLeafProps;
  type: { label: string, value: string };
  options: MappedQuestionOptionProps[];
  ctaNodes: CTANode[];
  onActiveQuestionChange: React.Dispatch<React.SetStateAction<string | null>>;
  condition: EdgeConditionProps | undefined;
  parentOptions: MappedQuestionOptionProps[] | undefined;
  edgeId: string | undefined;
  question: QuestionEntryProps;
  parentQuestionId?: string;
  parentQuestionType: string;
  onDeleteEntry: any;
  onScroll: () => void;
}

const createQuestionMutation = gql`
  mutation createQuestion($input: CreateQuestionNodeInputType!) {
    createQuestion(input: $input) {
        id
    }
  }
`;

const setOverrideLeaf = (ctaNodes: CTANode[], overrideLeafId?: string) => {
  const activeLeaf = ctaNodes.find((node) => node.id === overrideLeafId);
  if (!activeLeaf) return null;

  return { value: activeLeaf.id, label: activeLeaf.title, type: activeLeaf.type };
};

const DialogueBuilderQuestionForm = ({
  onAddExpandChange,
  id,
  title,
  overrideLeaf,
  type,
  options,
  ctaNodes,
  onActiveQuestionChange,
  condition,
  parentOptions,
  question,
  parentQuestionType,
  parentQuestionId,
  edgeId,
  onDeleteEntry,
  onScroll,
}: QuestionEntryFormProps) => {
  const { activeCustomer } = useCustomer();
  const { t } = useTranslation();
  const { customerSlug, dialogueSlug } = useNavigator();

  const sliderNode = {
    id: question.sliderNode?.id,
    markers: question.sliderNode?.markers.map((marker: SliderNodeMarkerProps) => ({
      id: marker.id,
      label: marker.label,
      subLabel: marker.subLabel,
      range: {
        start: marker.range.start,
        end: marker.range.end,
      },
    })),
  };

  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
      parentQuestionType,
      sliderNode,
      unhappyText: question.sliderNode?.unhappyText,
      happyText: question.sliderNode?.happyText,
      overrideLeaf: setOverrideLeaf(ctaNodes, overrideLeaf?.id),
      optionsFull: options,
      range: [condition?.renderMin ?? 30, condition?.renderMax ?? 70],
      questionType: type?.value,
      // optionsFull: options.map((option) => ({
      //   id: option.id,
      //   position: option.position,
      //   value: option.value,
      //   publicValue: option.publicValue,
      //   overrideLeaf: {
      //     label: option.overrideLeaf?.title,
      //     value: option.overrideLeaf?.id,
      //     type: option.overrideLeaf?.type,
      //   },
      // })),
    },
  });

  const toast = useToast();

  const matchValue = condition?.matchValue ? { label: condition.matchValue, value: condition.matchValue } : null;
  const [activeMatchValue, setActiveMatchValue] = useState<null | { label: string, value: string }>(matchValue);
  const [activeConditionSelect, setActiveConditionSelect] = useState<null | { label: string, value: string }>(
    condition?.conditionType ? {
      value: condition.conditionType,
      label: condition.conditionType,
    } : null,
  );

  const [activeCondition, setActiveCondition] = useState<null | EdgeConditionProps>(
    condition || { conditionType: parentQuestionType === 'Slider' ? 'valueBoundary' : 'match' },
  );

  const questionType = useWatch({
    control: form.control,
    name: 'questionType',
    defaultValue: type?.value,
  });

  const setConditionType = useCallback((conditionOption: any) => {
    setActiveConditionSelect(conditionOption);
    setActiveCondition((prevCondition) => {
      if (!prevCondition) {
        return { conditionType: conditionOption.value };
      }
      prevCondition.conditionType = conditionOption.value;
      return prevCondition;
    });
  }, [setActiveConditionSelect, setActiveCondition]);

  useEffect(() => {
    form.register('parentQuestionType');
    form.setValue('parentQuestionType', parentQuestionType);
  }, [parentQuestionType]);

  const handleConditionTypeChange = useCallback((selectedOption: any) => {
    form.setValue('conditionType', selectedOption?.value);
    setConditionType(selectedOption);
  }, [setConditionType]);

  useEffect(() => {
    if (activeConditionSelect) {
      handleConditionTypeChange(activeConditionSelect);
    }
  }, [activeConditionSelect, handleConditionTypeChange]);

  const setMatchTextValue = (qOption: any) => {
    const matchText = qOption.value;
    form.setValue('matchText', matchText);
    setActiveMatchValue(qOption);
    return setActiveCondition((prevCondition) => {
      if (!prevCondition) {
        return { matchValue: matchText };
      }
      prevCondition.matchValue = matchText;
      return prevCondition;
    });
  };

  useEffect(() => {
    if (activeMatchValue?.value) {
      form.setValue('matchText', activeMatchValue?.value);
    }
  }, [activeMatchValue]);

  const [createQuestion, { loading: createLoading }] = useMutation(createQuestionMutation, {
    onCompleted: () => {
      if (onAddExpandChange) {
        onAddExpandChange(false);
      }
      onScroll();
      onActiveQuestionChange(null);

      toast({
        title: 'Node saved',
        description: 'Node as saved',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
    },
    refetchQueries: [{
      query: getTopicBuilderQuery,
      variables: {
        customerSlug,
        dialogueSlug,
      },
    }],
    onError: (serverError: any) => {
      // eslint-disable-next-line no-console
      console.log(serverError);

      toast({
        title: 'Something went wrong',
        description: 'There was a problem saving the node. Please try again',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
  });

  const [updateQuestion, { loading: updateLoading }] = useMutation(updateQuestionMutation, {
    onCompleted: () => {
      onActiveQuestionChange(null);
      onScroll();

      toast({
        title: 'Node saved',
        description: 'Node as saved',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
    },
    refetchQueries: [{
      query: getTopicBuilderQuery,
      variables: {
        customerSlug,
        dialogueSlug,
      },
    }],
    onError: (serverError: any) => {
      // eslint-disable-next-line no-console
      console.log(serverError);
      toast({
        title: 'Something went wrong',
        description: 'There was a problem in saving the node. Please try again',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
  });

  const handleCancelQuestion = () => {
    if (question.id === '-1' && onAddExpandChange) {
      onAddExpandChange(false);
    }
    onActiveQuestionChange(null);
    onScroll();
  };

  const handleRemoveCTA = () => {
    form.setValue('overrideLeaf', null);
  };

  const onSubmit = (formData: FormDataProps) => {
    const { title } = formData;
    const type = formData.questionType;
    const overrideLeafId = formData.overrideLeaf?.value;
    const edgeCondition: EdgeConditionProps = {
      id: activeCondition?.id,
      conditionType: activeCondition?.conditionType,
      matchValue: activeCondition?.conditionType === 'match' ? activeCondition?.matchValue : null,
      renderMin: activeCondition?.conditionType === 'valueBoundary' ? formData.range[0] : null,
      renderMax: activeCondition?.conditionType === 'valueBoundary' ? formData.range[1] : null,
    };

    const sliderNodeData = formData.sliderNode || sliderNode;

    const isSlider = type === QuestionNodeTypeEnum.Slider && sliderNodeData;
    const values = form.getValues();
    console.log('values', values);

    const unhappyText = formData.useCustomerSatisfactionTexts === 1 ? formData.unhappyText : null;
    const happyText = formData.useCustomerSatisfactionTexts === 1 ? formData.happyText : null;

    if (question.id !== '-1') {
      updateQuestion({
        variables: {
          input: {
            id,
            unhappyText,
            happyText,
            extraContent: formData.videoEmbedded,
            customerId: activeCustomer?.id,
            overrideLeafId: overrideLeafId || '',
            edgeId: edgeId || '-1',
            title,
            type,
            optionEntries: {
              options: values.optionsFull?.map((option, index) => ({
                id: option?.id,
                value: option?.value,
                publicValue: option?.value,
                overrideLeafId: option?.overrideLeaf?.value,
                position: index + 1,
              })),
            },
            edgeCondition,
            sliderNode: isSlider ? {
              id: sliderNodeData.id,
              markers: sliderNodeData.markers.map((marker, index) => ({
                id: marker.id,
                label: marker.label,
                subLabel: marker.subLabel,
                // We use the range from the incoming sliderNode
                range: sliderNode?.markers?.[index].range,
              })),
            } : undefined,
          },
        },
      });
    } else {
      createQuestion({
        variables: {
          input: {
            customerId: activeCustomer?.id,
            dialogueSlug,
            title,
            type,
            unhappyText,
            happyText,
            extraContent: formData.videoEmbedded,
            overrideLeafId: overrideLeafId || '',
            parentQuestionId,
            optionEntries: {
              options: values.optionsFull?.map((option, index) => ({
                id: option?.id,
                value: option?.value,
                publicValue: option?.value,
                overrideLeafId: option?.overrideLeaf?.value,
                position: index + 1,
              })),
            },
            edgeCondition,
            sliderNode: isSlider ? {
              id: sliderNodeData.id,
              markers: sliderNodeData.markers.map((marker, index) => ({
                id: marker.id,
                label: marker.label,
                subLabel: marker.subLabel,
                // We use the range from the incoming sliderNode
                range: sliderNode?.markers?.[index].range,
              })),
            } : undefined,
          },
        },
      });
    }
  };

  const parentOptionsSelect = parentOptions?.map((option) => ({ label: option.value, value: option.value }));
  const formattedCtaNodes = ctaNodes.map((ctaNode) => ({
    value: ctaNode.id,
    label: ctaNode.title,
    type: ctaNode.type,
  }));

  return (
    <UI.FormContainer expandedForm>
      <UI.Hr />
      <UI.Form onSubmit={form.handleSubmit(onSubmit)}>
        <UI.Div>
          <UI.FormSection id="general">
            <UI.Div>
              <UI.FormSectionHeader>{t('dialogue:about_question')}</UI.FormSectionHeader>
              <UI.FormSectionHelper>
                {t('dialogue:about_question_helper')}
              </UI.FormSectionHelper>
            </UI.Div>
            <UI.InputGrid>
              <UI.FormControl isRequired isInvalid={!!form.formState.errors.title}>
                <UI.FormLabel htmlFor="title">{t('title')}</UI.FormLabel>
                <UI.InputHelper>{t('dialogue:title_question_helper')}</UI.InputHelper>
                <Controller
                  name="title"
                  control={form.control}
                  defaultValue={title}
                  render={({ field }) => (
                    <UI.MarkdownEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <FormErrorMessage>{form.formState.errors.title?.message}</FormErrorMessage>
              </UI.FormControl>
            </UI.InputGrid>
          </UI.FormSection>

          {parentQuestionType === 'Slider' && (
            <>
              <UI.Hr />
              <UI.Div />
              <UI.FormSection>
                <UI.Div>
                  <UI.FormSectionHeader>{t('dialogue:condition')}</UI.FormSectionHeader>
                  <UI.FormSectionHelper>
                    {t('dialogue:condition_helper')}
                  </UI.FormSectionHelper>
                </UI.Div>
                <Div>
                  <InputGrid>
                    <FormControl isRequired isInvalid={!!form.formState.errors.minValue}>
                      <FormLabel htmlFor="minValue">
                        {t('range')}
                      </FormLabel>
                      <InputHelper>
                        {t('range_helper')}
                      </InputHelper>
                      <UI.Div position="relative" pb={3}>
                        <Controller
                          control={form.control}
                          name="range"
                          defaultValue={[40, 69]}
                          render={({ field }) => (
                            <UI.RangeSlider
                              onChange={field.onChange}
                              defaultValue={field.value}
                              // isDisabled
                              stepSize={1}
                              min={0}
                              max={100}
                            />
                          )}
                        />
                        <FormErrorMessage>{form.formState.errors.minValue?.message}</FormErrorMessage>
                        <UI.Div position="absolute" bottom={0} left={0}>0</UI.Div>
                        <UI.Div position="absolute" bottom={0} right={-7.5}>100</UI.Div>
                      </UI.Div>

                    </FormControl>
                  </InputGrid>
                </Div>
              </UI.FormSection>
            </>
          )}

          {(parentQuestionType === 'Choice' || parentQuestionType === 'Video embedded') && (
            <>
              <UI.Hr />
              <UI.FormSection>
                <UI.Div>
                  <UI.FormSectionHeader>{t('dialogue:condition')}</UI.FormSectionHeader>
                  <UI.FormSectionHelper>
                    {t('dialogue:condition_helper')}
                  </UI.FormSectionHelper>
                </UI.Div>
                <UI.Div>
                  <UI.InputGrid>
                    <UI.FormControl isRequired isInvalid={!!form.formState.errors.matchText}>
                      <UI.FormLabel htmlFor="matchText">{t('match_value')}</UI.FormLabel>
                      <UI.InputHelper>What is the multi-choice question to trigger this question?</UI.InputHelper>

                      <Controller
                        // TODO: HOw to add back id="question-match-select"
                        name="matchText"
                        control={form.control}
                        defaultValue={activeMatchValue as any}
                        render={() => (
                          <Select
                            options={parentOptionsSelect}
                            value={activeMatchValue}
                            onChange={(opt: any) => {
                              setMatchTextValue(opt);
                            }}
                          />
                        )}
                      />
                      <FormErrorMessage>{form.formState.errors.matchText?.message}</FormErrorMessage>
                    </UI.FormControl>
                  </UI.InputGrid>
                </UI.Div>
              </UI.FormSection>
            </>
          )}

          <UI.Hr />

          <UI.FormSection>
            <UI.Div>
              <UI.FormSectionHeader>
                {t('dialogue:question_type')}
              </UI.FormSectionHeader>
              <UI.FormSectionHelper>
                {t('dialogue:about_type_helper')}
              </UI.FormSectionHelper>
            </UI.Div>
            <Div>
              <InputGrid>
                <UI.FormControl isRequired isInvalid={!!form.formState.errors.questionType}>
                  <UI.FormLabel htmlFor="questionType">{t('dialogue:question_type')}</UI.FormLabel>
                  <UI.InputHelper>
                    {t('dialogue:question_type_helper')}
                  </UI.InputHelper>
                  <Controller
                    control={form.control}
                    // TODO: How to add back id="question-type-select"
                    name="questionType"
                    render={({ field }) => (
                      <UI.RadioButtons
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      >
                        <UI.RadioButton
                          icon={Sliders}
                          value={QuestionNodeTypeEnum.Slider}
                          text={t('slider')}
                          description={t('slider_helper')}
                        />
                        <UI.RadioButton
                          icon={List}
                          value={QuestionNodeTypeEnum.Choice}
                          text={t('multiple_choice')}
                          description={t('multiple_choice_helper')}
                        />
                        <UI.RadioButton
                          icon={Youtube}
                          value={QuestionNodeTypeEnum.VideoEmbedded}
                          text={t('video')}
                          description={t('video_helper')}
                        />
                      </UI.RadioButtons>
                    )}
                  />
                  <FormErrorMessage>{form.formState.errors.questionType?.message}</FormErrorMessage>
                </UI.FormControl>

                {questionType === QuestionNodeTypeEnum.VideoEmbedded && (
                  <UI.FormControl isRequired isInvalid={!!form.formState.errors.videoEmbedded}>
                    <UI.FormLabel htmlFor="videoEmbedded">
                      {t('video_embedded')}
                    </UI.FormLabel>
                    <UI.InputHelper>
                      {t('video_embedded_helper')}
                    </UI.InputHelper>
                    <UI.Input
                      leftAddOn="https://www.youtube.com/watch?v="
                      {...form.register('videoEmbedded')}
                      defaultValue={question.extraContent || undefined}
                    />
                    <FormErrorMessage>{form.formState.errors.videoEmbedded?.message}</FormErrorMessage>
                  </UI.FormControl>
                )}

                <UI.FormControl isInvalid={!!form.formState.errors.activeLeaf}>
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
                                name="overrideLeaf"
                                control={form.control}
                                // defaultValue={currentOverrideLeaf}
                                render={({ field }) => (
                                  <Dropdown renderOverlay={({ setCloseClickOnOutside, onClose }) => (
                                    <NodePicker
                                      items={formattedCtaNodes}
                                      onClose={onClose}
                                      onChange={field.onChange}
                                      onModalOpen={() => setCloseClickOnOutside(false)}
                                      onModalClose={() => setCloseClickOnOutside(true)}
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
                                        {field.value?.label ? (
                                          <NodeCell onRemove={handleRemoveCTA} onClick={onOpen} node={field.value} />
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
                  <FormErrorMessage>{form.formState.errors.activeLeaf?.message}</FormErrorMessage>
                </UI.FormControl>
              </InputGrid>
            </Div>
          </UI.FormSection>

          {questionType === QuestionNodeTypeEnum.Slider && (
            <>
              <UI.Hr />
              <UI.FormSection>
                <UI.Div>
                  <UI.FormSectionHeader>{t('dialogue:about_slider')}</UI.FormSectionHeader>
                  <UI.FormSectionHelper>
                    {t('dialogue:about_slider_helper')}
                  </UI.FormSectionHelper>
                </UI.Div>
                <SliderNodeForm
                  form={form}
                />
              </UI.FormSection>
            </>
          )}

          {(questionType === QuestionNodeTypeEnum.Choice || questionType === QuestionNodeTypeEnum.VideoEmbedded) && (
            <>
              <UI.Hr />
              <UI.FormSection>
                <UI.Div>
                  <UI.FormSectionHeader>{t('dialogue:about_choice')}</UI.FormSectionHeader>
                  <UI.FormSectionHelper>
                    {t('dialogue:about_choice_helper')}
                  </UI.FormSectionHelper>
                </UI.Div>
                <ChoiceNodeForm
                  form={form}
                  ctaNodes={ctaNodes}
                />
              </UI.FormSection>
            </>
          )}
        </UI.Div>

        <UI.Flex justifyContent="space-between">
          <ButtonGroup>
            <Button
              isLoading={createLoading || updateLoading}
              isDisabled={!form.formState.isValid}
              variantColor="teal"
              type="submit"
            >
              {t('save')}
            </Button>
            <Button variant="outline" onClick={() => handleCancelQuestion()}>Cancel</Button>
          </ButtonGroup>
          <UI.Span onClick={(e) => e.stopPropagation()}>
            <Popover
              usePortal
            >
              {() => (
                <>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      variantColor="red"
                      leftIcon={Trash}
                    >
                      {t('delete')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent zIndex={4}>
                    <PopoverArrow />
                    <PopoverHeader>{t('delete')}</PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                      <UI.Text>{t('delete_question_popover')}</UI.Text>
                    </PopoverBody>
                    <PopoverFooter>
                      <Button
                        variant="outline"
                        variantColor="red"
                        onClick={() => onDeleteEntry && onDeleteEntry()}
                      >
                        {t('delete')}
                      </Button>
                    </PopoverFooter>
                  </PopoverContent>
                </>
              )}
            </Popover>
          </UI.Span>
        </UI.Flex>
      </UI.Form>
    </UI.FormContainer>

  );
};

export default DialogueBuilderQuestionForm;
