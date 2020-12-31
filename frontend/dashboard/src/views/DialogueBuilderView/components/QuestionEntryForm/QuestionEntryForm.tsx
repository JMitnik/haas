/* eslint-disable react-hooks/exhaustive-deps */
import * as UI from '@haas/ui';
import * as yup from 'yup';
import { ApolloError } from 'apollo-client';
import { Button, ButtonGroup, FormErrorMessage, Popover, PopoverArrow,
  PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast } from '@chakra-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { MinusCircle, PlusCircle, Trash } from 'react-feather';
import { debounce } from 'lodash';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import {
  DeleteQuestionOptionButtonContainer,
} from 'views/DialogueBuilderView/components/QuestionEntry/QuestionEntryStyles';
import { Div, Flex, Form, FormContainer, FormControl, FormLabel,
  FormSection, H4, Hr, Input, InputGrid, InputHelper, Muted, Span, Text } from '@haas/ui';
import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import { useCustomer } from 'providers/CustomerProvider';
import createQuestionMutation from 'mutations/createQuestion';
import updateQuestionMutation from 'mutations/updateQuestion';

import { EdgeConditonProps,
  OverrideLeafProps, QuestionEntryProps, QuestionOptionProps } from '../../DialogueBuilderInterfaces';
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
  questionType: string;
  matchText: string;
  activeLeaf: string;
  parentQuestionType: string;
  sliderNode: {
    id: string;
    markers: SliderNodeMarkerProps[];
  };
  options: Array<string>;
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
  options: yup.array().of(yup.string().min(1)).when(['questionType'], {
    is: (questionType: string) => isChoiceType(questionType),
    then: yup.array(yup.string().min(1)).min(1).required(),
    otherwise: yup.array(yup.string()).notRequired(),
  }),
});

interface QuestionEntryFormProps {
  onAddExpandChange?: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  title: string;
  overrideLeaf?: OverrideLeafProps;
  isRoot: boolean;
  type: { label: string, value: string };
  options: Array<QuestionOptionProps>;
  leafs: Array<{ label: string, value: string }>;
  onActiveQuestionChange: React.Dispatch<React.SetStateAction<string | null>>;
  condition: EdgeConditonProps | undefined;
  parentOptions: QuestionOptionProps[] | undefined;
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
];

const QuestionEntryForm = ({
  onAddExpandChange,
  id,
  title,
  overrideLeaf,
  type,
  options,
  leafs,
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
  const { customerSlug, dialogueSlug } = useParams();

  const { t } = useTranslation();

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
    defaultValues: {
      parentQuestionType,
      sliderNode,
    },
  });

  console.log('question', question);

  const toast = useToast();
  const [activeQuestionType, setActiveQuestionType] = useState(type);

  const [activeOptions, setActiveOptions] = useState(options);

  const matchValue = condition?.matchValue ? { label: condition.matchValue, value: condition.matchValue } : null;
  const [activematchValue, setActiveMatchValue] = useState<null | {label: string, value: string}>(matchValue);
  const [activeLeaf, setActiveLeaf] = useState({ label: overrideLeaf?.title, value: overrideLeaf?.id });
  const [activeConditionSelect, setActiveConditionSelect] = useState<null | { label: string, value: string}>(
    condition?.conditionType ? {
      value: condition.conditionType,
      label: condition.conditionType,
    } : null,
  );
  const [activeCondition, setActiveCondition] = useState<null | EdgeConditonProps>(condition || { conditionType: parentQuestionType === 'Slider' ? 'valueBoundary' : 'match' });

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

  const handleLeafChange = useCallback((selectedOption: any) => {
    form.setValue('activeLeaf', selectedOption?.value);
    setActiveLeaf(selectedOption);
  }, [setActiveLeaf]);

  useEffect(() => {
    if (activeLeaf) {
      handleLeafChange(activeLeaf);
    }
  }, [activeLeaf, handleLeafChange]);

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
    if (activematchValue?.value) {
      form.setValue('matchText', activematchValue?.value);
    }
  }, [activematchValue]);

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
    onError: (serverError: ApolloError) => {
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
    onError: (serverError: ApolloError) => {
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

  const handleOptionChange = useCallback(debounce((value: any, optionIndex: number) => {
    setActiveOptions((prevOptions) => {
      prevOptions[optionIndex].value = value;
      return [...prevOptions];
    });
  }, 250), []);

  const deleteOption = (event: any, optionIndex: number) => {
    setActiveOptions((prevOptions) => {
      prevOptions.splice(optionIndex, 1);
      return [...prevOptions];
    });
  };

  const addNewOption = () => {
    setActiveOptions((prevOptions) => {
      const value = '';
      const publicValue = '';
      const newActiveOptions = [...prevOptions, { value, publicValue }];
      return newActiveOptions;
    });
  };

  const onSubmit = (formData: FormDataProps) => {
    const { title } = formData;
    const type = activeQuestionType?.value;
    const overrideLeafId = activeLeaf?.value;
    const options = { options: activeOptions };
    const edgeCondition = activeCondition;
    const sliderNodeData = formData.sliderNode || sliderNode;

    const isSlider = activeQuestionType?.value === 'SLIDER' && sliderNodeData;

    if (question.id !== '-1') {
      updateQuestion({
        variables: {
          input: {
            id,
            customerId: activeCustomer?.id,
            overrideLeafId: overrideLeafId || '',
            edgeId: edgeId || '-1',
            title,
            type,
            optionEntries: options,
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
            overrideLeafId: overrideLeafId || 'None',
            parentQuestionId,
            optionEntries: options,
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
  return (
    <FormContainer expandedForm>
      <Hr />
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Div>
          <FormSection id="general">
            <Div>
              <UI.FormSectionHeader>{t('dialogue:about_question')}</UI.FormSectionHeader>
              <UI.FormSectionHelper>
                {t('dialogue:about_question_helper')}
              </UI.FormSectionHelper>
            </Div>
            <InputGrid>
              <FormControl isRequired isInvalid={!!form.errors.title}>
                <FormLabel htmlFor="title">{t('title')}</FormLabel>
                <InputHelper>{t('dialogue:title_question_helper')}</InputHelper>
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
              </FormControl>
            </InputGrid>
          </FormSection>

          {parentQuestionType === 'Slider' && (
            <>
              <Hr />
              <UI.Div />
              <FormSection>
                <Div>
                  <UI.FormSectionHeader>{t('dialogue:condition')}</UI.FormSectionHeader>
                  <UI.FormSectionHelper>
                    {t('dialogue:condition_helper')}
                  </UI.FormSectionHelper>
                </Div>
                <Div>
                  <InputGrid>
                    <FormControl isRequired isInvalid={!!form.errors.minValue}>
                      <FormLabel htmlFor="minValue">
                        {t('min_value')}
                      </FormLabel>
                      <InputHelper>
                        {t('dialogue:min_value_helper')}
                      </InputHelper>
                      <Input
                        name="minValue"
                        ref={form.register({ required: false })}
                        defaultValue={condition?.renderMin}
                        onBlur={(event: React.FocusEvent<HTMLInputElement>) => setMinValue(event)}
                      />
                      <FormErrorMessage>{form.errors.minValue?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!form.errors.maxValue}>
                      <FormLabel htmlFor="maxValue">
                        {t('max_value')}
                      </FormLabel>
                      <InputHelper>
                        {t('dialogue:max_value_helper')}
                      </InputHelper>
                      <Input
                        name="maxValue"
                        ref={form.register({ required: false })}
                        defaultValue={condition?.renderMax}
                        onChange={(event: any) => setMaxValue(event.target.value)}
                      />
                      <FormErrorMessage>{form.errors.maxValue?.message}</FormErrorMessage>
                    </FormControl>

                  </InputGrid>
                </Div>
              </FormSection>
            </>
          )}

          {parentQuestionType === 'Choice' && (
            <>
              <Hr />
              <FormSection>
                <Div>
                  <UI.FormSectionHeader>{t('dialogue:condition')}</UI.FormSectionHeader>
                  <UI.FormSectionHelper>
                    {t('dialogue:condition_helper')}
                  </UI.FormSectionHelper>
                </Div>
                <Div>
                  <InputGrid>
                    <FormControl isRequired isInvalid={!!form.errors.matchText}>
                      <FormLabel htmlFor="matchText">{t('dialogue:match_value')}</FormLabel>
                      <InputHelper>What is the multi-choice question to trigger this question?</InputHelper>

                      <Controller
                        id="question-match-select"
                        name="matchText"
                        control={form.control}
                        defaultValue={activematchValue}
                        render={({ onChange, onBlur, value }) => (
                          <Select
                            options={parentOptionsSelect}
                            value={activematchValue}
                            onChange={(opt: any) => {
                              setMatchTextValue(opt);
                            }}
                          />
                        )}
                      />
                      <FormErrorMessage>{form.errors.matchText?.message}</FormErrorMessage>
                    </FormControl>
                  </InputGrid>
                </Div>
              </FormSection>
            </>
          )}

          <Hr />

          <FormSection>
            <Div>
              <UI.FormSectionHeader>
                {t('dialogue:question_type')}
              </UI.FormSectionHeader>
              <UI.FormSectionHelper>
                {t('dialogue:about_type_helper')}
              </UI.FormSectionHelper>
            </Div>
            <Div>
              <InputGrid>
                <FormControl isRequired isInvalid={!!form.errors.questionType}>
                  <FormLabel htmlFor="questionType">
                    {t('dialogue:question_type')}
                  </FormLabel>
                  <InputHelper>
                    {t('dialogue:question_type_helper')}
                  </InputHelper>
                  <Controller
                    id="question-type-select"
                    name="questionType"
                    control={form.control}
                    defaultValue={activeQuestionType}
                    render={({ onChange, onBlur, value }) => (
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
                </FormControl>

                <FormControl isInvalid={!!form.errors.activeLeaf}>
                  <FormLabel htmlFor="questionType">
                    {t('call_to_action')}
                  </FormLabel>
                  <InputHelper>
                    {t('dialogue:cta_helper')}
                  </InputHelper>
                  <Controller
                    id="question-type-select"
                    name="activeLeaf"
                    control={form.control}
                    defaultValue={(activeLeaf?.value && activeLeaf) || leafs[0]}
                    render={({ onChange, onBlur, value }) => (
                      <Select
                        options={leafs}
                        value={(activeLeaf?.value && activeLeaf) || leafs[0]}
                        onChange={(opt: any) => {
                          handleLeafChange(opt);
                          onChange(opt.value);
                        }}
                      />
                    )}
                  />
                  <FormErrorMessage>{form.errors.activeLeaf?.message}</FormErrorMessage>
                </FormControl>
              </InputGrid>
            </Div>
          </FormSection>

          {activeQuestionType && activeQuestionType.value === 'SLIDER' && (
            <>
              <UI.Hr />
              <FormSection>
                <UI.Div>
                  <UI.FormSectionHeader>{t('dialogue:about_slider')}</UI.FormSectionHeader>
                  <UI.FormSectionHelper>
                    {t('dialogue:about_slider_helper')}
                  </UI.FormSectionHelper>
                </UI.Div>
                <SliderNodeForm
                  form={form}
                />
              </FormSection>
            </>
          )}

          {activeQuestionType && activeQuestionType.value === 'CHOICE' && (
          <FormSection>
            <UI.Div />
            <UI.Div>
              <Div mb={1} gridColumn="1 / -1">
                <Flex justifyContent="space-between">
                  <H4>
                    {t('options')}
                  </H4>
                  <PlusCircle data-cy="AddOption" style={{ cursor: 'pointer' }} onClick={() => addNewOption()} />
                </Flex>

                <Hr />
              </Div>

              {!activeOptions.length && !form.errors.options && <Muted>{t('dialogue:add_option_reminder')}</Muted>}
              {!activeOptions.length && form.errors.options && <Muted color="red">{t('dialogue:empty_option_reminder')}</Muted>}
              {activeOptions && activeOptions.map((option, optionIndex) => (
                <Flex key={`container-${option.id}-${optionIndex}`} flexDirection="column">
                  <Flex my={1} flexDirection="row">
                    <Flex flexGrow={1}>
                      <Input
                        isInvalid={form.errors.options && Array.isArray(form.errors.options) && !!form.errors.options?.[optionIndex]}
                        id={`options[${optionIndex}]`}
                        key={`input-${option.id}-${optionIndex}`}
                        name={`options[${optionIndex}]`}
                        ref={form.register(
                          { required: true,
                            minLength: 1 },
                        )}
                        defaultValue={option.value}
                        onChange={(e: any) => handleOptionChange(e.currentTarget.value, optionIndex)}
                      />
                    </Flex>

                    <DeleteQuestionOptionButtonContainer
                      onClick={(e: any) => deleteOption(e, optionIndex)}
                    >
                      <MinusCircle />
                    </DeleteQuestionOptionButtonContainer>
                  </Flex>
                  {form.errors.options?.[optionIndex] && <Muted color="warning">Please fill in a proper value!</Muted>}
                </Flex>
              ))}
            </UI.Div>
          </FormSection>
          )}
        </Div>

        <Flex justifyContent="space-between">
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
          <Span onClick={(e) => e.stopPropagation()}>
            <Popover
              usePortal
            >
              {({ onClose }) => (
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
                      <Text>{t('delete_question_popover')}</Text>
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
          </Span>
        </Flex>
      </Form>
    </FormContainer>

  );
};

export default QuestionEntryForm;
