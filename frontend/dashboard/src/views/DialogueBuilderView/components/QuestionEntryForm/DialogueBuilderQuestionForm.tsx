import * as UI from '@haas/ui';
import * as _ from 'lodash';
import * as yup from 'yup';
import {
  Button, ButtonGroup, FormErrorMessage, Popover, PopoverArrow,
  PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast,
} from '@chakra-ui/core';
import { Controller, UseFormMethods, useForm, useWatch } from 'react-hook-form';

import { AnimatePresence, motion } from 'framer-motion';
import { PlusCircle, Trash } from 'react-feather';
import { Route, Switch, useLocation } from 'react-router';
import { debounce } from 'lodash';
import { gql, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Select from 'react-select';

import { NodeCell } from 'components/NodeCell';
import { NodePicker } from 'components/NodePicker';
import { QuestionNodeTypeEnum } from 'types/generated-types';
import { ROUTES, useNavigator } from 'hooks/useNavigator';
import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import { useCustomer } from 'providers/CustomerProvider';
import Dropdown from 'components/Dropdown';
import updateQuestionMutation from 'mutations/updateQuestion';

import {
  CTANode,
  EdgeConditionProps,
  MappedCTANode,
  MappedQuestionOptionProps,
  OverrideLeafProps, QuestionEntryProps, QuestionOptionProps,
} from '../../DialogueBuilderInterfaces';
import { ChoiceNodeForm } from './ChoiceNodeForm';
import { NewCTAModalCard } from './NewCTAModalCard';
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
}

const isChoiceType = (questionType: string) => {
  if (questionType === 'CHOICE') {
    return true;
  }
  return false;
};

const schema = yup.object().shape({
  title: yup.string().required(),
  questionType: yup.string().required(),
  videoEmbedded: yup.string().when(['questionType'], {
    is: (questionType: string) => questionType === 'VIDEO_EMBEDDED',
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  minValue: yup.string().when(['parentQuestionType'], {
    is: (parentQuestionType: string) => parentQuestionType === 'Slider',
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  maxValue: yup.string().when(['parentQuestionType'], {
    is: (parentQuestionType: string) => parentQuestionType === 'Slider',
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  matchText: yup.string().when(['parentQuestionType'], {
    is: (parentQuestionType: string) => parentQuestionType === 'Choice',
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  optionsFull: yup.array().when(['questionType'], {
    is: (questionType: string) => isChoiceType(questionType),
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

const questionTypes = [
  { value: 'SLIDER', label: 'Slider' },
  { value: 'CHOICE', label: 'Choice' },
  { value: 'VIDEO_EMBEDDED', label: 'Video embedded' },
];

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

interface UseOptionsInput {
  form: UseFormMethods<FormDataProps>;
  options: MappedQuestionOptionProps[]
}

const useOptions = ({ form, options }: UseOptionsInput) => {
  const [activeOptions, setActiveOptions] = useState<MappedQuestionOptionProps[] | null>(null);
  const [activeOptionLeaf, setActiveOptionLeaf] = useState<any>();
  const [newActiveOptions, setNewActiveOptions] = useState(null);
  const verifiedRef = useRef(false);

  useEffect(() => {
    console.log('activeOptionLeaf ', activeOptionLeaf);
    // If undefined but there is overrideLeafID => set it as activeId
    // if (typeof activeOptions === 'undefined' && options) {
    //   setActiveOptions(options);
    // }
    if (!verifiedRef.current) {
      console.log('SETTING REFFFFFFFFFFFFF');
      verifiedRef.current = true;
      setActiveOptions(options);
    }

    if (activeOptionLeaf?.newOption) {
      const { targetIndex, newOption } = activeOptionLeaf;
      console.log('NEWWWW OPTION: ', newOption);
      const mappedResult = activeOptions?.map((option, oldIndex) => {
        if (oldIndex === targetIndex) {
          return {
            id: 1337,
            value: 'IETS ANDERS',
            position: undefined,
            publicValue: 'IETS ANDERS',
            kaas: {
              bestaat: 'ofniet?',
            },
            overrideLeaf: {
              label: 'LABEL',
              type: QuestionNodeTypeEnum.Registration,
              value: 'VALUE',
            },
          };
        }
        return option;
      }) || [];
      console.log('mapped result: ', mappedResult);
      form.setValue('optionsFull', mappedResult);
      // setActiveOptionLeaf(null);

      // setActiveOptions((oldOptions) => {
      //   const clone = _.cloneDeep(oldOptions);
      //   clone?.splice(targetIndex, 1, newOption);
      //   console.log(clone);
      //   return clone;
      // });
    }
  }, [activeOptions, setActiveOptions, activeOptionLeaf]);

  // useEffect(() => {
  //   if (activeOptions) {
  //     console.log('Hoe vaak hier: ', activeOptions);
  //     form.setValue('optionsFull', activeOptions);
  //     setActiveOptionLeaf(null);
  //   }
  // }, [activeOptions]);
  return { activeOptions, setActiveOptionLeaf };
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
  const { customerSlug, dialogueSlug, goToDialogueBuilderOverview, goToNewQuestionCTAView } = useNavigator();
  const location = useLocation();

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
    },
  });

  const [activeCTAId, setActiveCTAId] = useState<string | undefined | null>(overrideLeaf?.id);

  const { activeOptions, setActiveOptions, setActiveOptionLeaf } = useOptions({ form, options });

  const watchOptions = useWatch({
    control: form.control,
    name: 'optionsFull',
    defaultValue: options,
  });

  // console.log('CUSTOM HOOK: ', watchOptions);

  useEffect(() => {
    // If undefined but there is overrideLeafID => set it as activeId
    if (typeof activeCTAId === 'undefined' && overrideLeaf?.id) {
      setActiveCTAId(overrideLeaf?.id);
    }

    // If there is an activeCTAId set => override the current overrideLeaf with it
    if (activeCTAId) {
      form.setValue('overrideLeaf', setOverrideLeaf(ctaNodes, activeCTAId));
    }
  }, [ctaNodes, activeCTAId, overrideLeaf, setActiveCTAId]);

  const toast = useToast();
  const [activeQuestionType, setActiveQuestionType] = useState(type);

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

  const handleQuestionTypeChange = useCallback((selectOption: any) => {
    form.setValue('questionType', selectOption?.value);
    setActiveQuestionType(selectOption);
  }, [setActiveQuestionType]);

  useEffect(() => {
    form.register({ name: 'parentQuestionType' });
    form.setValue('parentQuestionType', parentQuestionType);
  }, [parentQuestionType]);

  useEffect(() => {
    if (activeQuestionType) {
      handleQuestionTypeChange(activeQuestionType);
    }
  }, [activeQuestionType, handleQuestionTypeChange]);

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

  const setMinValue = (event: React.FocusEvent<HTMLInputElement>) => {
    const minValue = Number(event.target.value);
    return setActiveCondition((prevCondition) => {
      if (!prevCondition) {
        return { renderMin: minValue };
      }
      prevCondition.renderMin = minValue;
      return prevCondition;
    });
  };

  const setMaxValue = useCallback(debounce((value: string) => {
    const maxValue = Number(value);
    return setActiveCondition((prevCondition) => {
      if (!prevCondition) {
        return { renderMax: maxValue };
      }
      prevCondition.renderMax = maxValue;
      return prevCondition;
    });
  }, 250), []);

  const onSubmit = (formData: FormDataProps) => {
    const { title } = formData;
    const type = activeQuestionType?.value;
    const overrideLeafId = formData?.overrideLeaf?.value;
    const edgeCondition = activeCondition;
    const sliderNodeData = formData.sliderNode || sliderNode;

    const isSlider = activeQuestionType?.value === 'SLIDER' && sliderNodeData;
    const values = form.getValues();

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
  // const currentOverrideLeaf = formattedCtaNodes.find((node) => node.value === activeLeaf.value);

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
              <UI.FormControl isRequired isInvalid={!!form.errors.title}>
                <UI.FormLabel htmlFor="title">{t('title')}</UI.FormLabel>
                <UI.InputHelper>{t('dialogue:title_question_helper')}</UI.InputHelper>
                <Controller
                  name="title"
                  control={form.control}
                  defaultValue={title}
                  render={({ value, onChange }) => (
                    <UI.MarkdownEditor
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
                <FormErrorMessage>{form.errors.title?.message}</FormErrorMessage>
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
                <UI.Div>
                  <UI.InputGrid>
                    <UI.FormControl isRequired isInvalid={!!form.errors.minValue}>
                      <UI.FormLabel htmlFor="minValue">
                        {t('min_value')}
                      </UI.FormLabel>
                      <UI.InputHelper>
                        {t('dialogue:min_value_helper')}
                      </UI.InputHelper>
                      <UI.Input
                        name="minValue"
                        ref={form.register({ required: false })}
                        defaultValue={condition?.renderMin}
                        onBlur={(event: React.FocusEvent<HTMLInputElement>) => setMinValue(event)}
                      />
                      <FormErrorMessage>{form.errors.minValue?.message}</FormErrorMessage>
                    </UI.FormControl>

                    <UI.FormControl isRequired isInvalid={!!form.errors.maxValue}>
                      <UI.FormLabel htmlFor="maxValue">
                        {t('max_value')}
                      </UI.FormLabel>
                      <UI.InputHelper>
                        {t('dialogue:max_value_helper')}
                      </UI.InputHelper>
                      <UI.Input
                        name="maxValue"
                        ref={form.register({ required: false })}
                        defaultValue={condition?.renderMax}
                        onChange={(event: any) => setMaxValue(event.target.value)}
                      />
                      <FormErrorMessage>{form.errors.maxValue?.message}</FormErrorMessage>
                    </UI.FormControl>

                  </UI.InputGrid>
                </UI.Div>
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
                    <UI.FormControl isRequired isInvalid={!!form.errors.matchText}>
                      <UI.FormLabel htmlFor="matchText">{t('match_value')}</UI.FormLabel>
                      <UI.InputHelper>What is the multi-choice question to trigger this question?</UI.InputHelper>

                      <Controller
                        id="question-match-select"
                        name="matchText"
                        control={form.control}
                        defaultValue={activeMatchValue}
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
                      <FormErrorMessage>{form.errors.matchText?.message}</FormErrorMessage>
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
            <UI.Div>
              <UI.InputGrid>
                <UI.FormControl isRequired isInvalid={!!form.errors.questionType}>
                  <UI.FormLabel htmlFor="questionType">
                    {t('dialogue:question_type')}
                  </UI.FormLabel>
                  <UI.InputHelper>
                    {t('dialogue:question_type_helper')}
                  </UI.InputHelper>
                  <Controller
                    id="question-type-select"
                    name="questionType"
                    control={form.control}
                    defaultValue={activeQuestionType}
                    render={({ onChange }) => (
                      <Select
                        options={questionTypes}
                        value={activeQuestionType}
                        onChange={(opt: any) => {
                          handleQuestionTypeChange(opt);
                          onChange(opt.value);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage>{form.errors.questionType?.message}</FormErrorMessage>
                </UI.FormControl>

                {form.watch('questionType') === 'VIDEO_EMBEDDED' && (
                  <UI.FormControl isRequired isInvalid={!!form.errors.videoEmbedded}>
                    <UI.FormLabel htmlFor="videoEmbedded">
                      {t('video_embedded')}
                    </UI.FormLabel>
                    <UI.InputHelper>
                      {t('video_embedded_helper')}
                    </UI.InputHelper>
                    <UI.Input
                      name="videoEmbedded"
                      leftAddOn="https://www.youtube.com/watch?v="
                      ref={form.register()}
                      defaultValue={question.extraContent || undefined}
                    />
                    <FormErrorMessage>{form.errors.videoEmbedded?.message}</FormErrorMessage>
                  </UI.FormControl>
                )}

                <UI.FormControl isInvalid={!!form.errors.activeLeaf}>
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
                            p={2}
                            borderBottom="1px solid #edf2f7"
                            gridTemplateColumns="2fr 1fr"
                          >
                            <UI.Div alignItems="center" display="flex">
                              <Controller
                                name="overrideLeaf"
                                control={form.control}
                                // defaultValue={currentOverrideLeaf}
                                render={({ value, onChange }) => (
                                  <Dropdown renderOverlay={({ onClose }) => (
                                    <NodePicker
                                      questionId={question.id}
                                      items={formattedCtaNodes}
                                      onClose={onClose}
                                      goToModal={() => goToNewQuestionCTAView(question.id)}
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
                                          <NodeCell onClick={onOpen} node={value} />
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
                            <UI.Stack alignItems="center" isInline spacing={2}>

                              <UI.Button
                                onClick={() => {
                                  form.setValue('overrideLeaf', null);
                                  setActiveCTAId(null);
                                }}
                                size="sm"
                                variantColor="red"
                                variant="outline"
                              >
                                <UI.Icon>
                                  <Trash />
                                </UI.Icon>
                              </UI.Button>
                            </UI.Stack>
                          </UI.Grid>
                        </>
                      </UI.Div>
                    </UI.Flex>
                  </UI.Div>
                  <FormErrorMessage>{form.errors.activeLeaf?.message}</FormErrorMessage>
                </UI.FormControl>
              </UI.InputGrid>
            </UI.Div>
          </UI.FormSection>

          {activeQuestionType && activeQuestionType.value === 'SLIDER' && (
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

          {activeQuestionType
            && (activeQuestionType.value === 'CHOICE'
              || activeQuestionType.value === 'VIDEO_EMBEDDED'
            ) && (
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
      <AnimatePresence>
        <Switch
          location={location}
          key={location.pathname}
        >
          <Route
            path={ROUTES.NEW_OPTION_CTA_VIEW}
          >
            {() => (
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <UI.Modal isOpen onClose={() => goToDialogueBuilderOverview()}>
                  <NewCTAModalCard
                    onClose={() => goToDialogueBuilderOverview()}
                    onSuccess={(data: { cta: MappedCTANode, optionIndex: string }) => {
                      const { cta, optionIndex } = data;
                      // eslint-disable-next-line radix
                      const targetIndex = parseInt(optionIndex);

                      const newOption = {
                        id: 1337,
                        value: 'IETS ANDERS',
                        position: undefined,
                        publicValue: 'IETS ANDERS',
                        overrideLeaf: {
                          label: 'HELP',
                          type: QuestionNodeTypeEnum.Registration,
                          value: 'VALUE',
                        },
                      };
                      setActiveOptionLeaf({ targetIndex, newOption });
                      goToDialogueBuilderOverview();
                    }}

                  />
                </UI.Modal>
              </motion.div>
            )}
          </Route>
          <Route
            path={ROUTES.NEW_QUESTION_CTA_VIEW}
          >
            {() => (
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <UI.Modal isOpen onClose={() => goToDialogueBuilderOverview()}>
                  <NewCTAModalCard
                    onClose={() => goToDialogueBuilderOverview()}
                    onSuccess={(newCtaId: string) => {
                      goToDialogueBuilderOverview();
                      setActiveCTAId(newCtaId);
                    }}
                  // @ts-ignore
                  />
                </UI.Modal>
              </motion.div>
            )}
          </Route>
        </Switch>
      </AnimatePresence>
    </UI.FormContainer>

  );
};

export default DialogueBuilderQuestionForm;
