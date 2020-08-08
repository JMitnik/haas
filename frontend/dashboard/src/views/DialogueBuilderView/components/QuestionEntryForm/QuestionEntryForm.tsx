
import * as yup from 'yup';
import { ApolloError } from 'apollo-client';
import { Button, FormErrorMessage, useToast } from '@chakra-ui/core';
import { MinusCircle, PlusCircle } from 'react-feather';
import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import {
  DeleteQuestionOptionButtonContainer,
} from 'views/DialogueBuilderView/components/QuestionEntry/QuestionEntryStyles';
import { Div, ErrorStyle, Flex, Form, FormContainer, FormControl, FormLabel,
  FormSection, Grid, H3, H4, Hr, InputGrid, InputHelper, Label, Muted, StyledInput } from '@haas/ui';
import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import createQuestionMutation from 'mutations/createQuestion';
import updateQuestionMutation from 'mutations/updateQuestion';

import { yupResolver } from '@hookform/resolvers';
import { EdgeConditonProps,
  OverrideLeafProps, QuestionEntryProps, QuestionOptionProps } from '../../DialogueBuilderInterfaces';

interface FormDataProps {
  title: string;
  minValue: string;
  maxValue: string;
  questionType: string;
  matchText: string;
  activeLeaf: string;
  parentQuestionType: string;
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
}

const questionTypes = [
  { value: 'SLIDER', label: 'Slider' },
  { value: 'CHOICE', label: 'Choice' }];

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
}: QuestionEntryFormProps) => {
  const { customerSlug, dialogueSlug } = useParams();

  const { register, handleSubmit, setValue, errors, getValues, formState } = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      parentQuestionType,
      options: [],
    },
  });

  const [activeTitle, setActiveTitle] = useState(title);
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
    setValue('questionType', selectOption?.value);
    setActiveQuestionType(selectOption);
  }, [setValue, setActiveQuestionType]);

  useEffect(() => {
    register({ name: 'parentQuestionType' });
    setValue('parentQuestionType', parentQuestionType);
  }, [setValue, register, parentQuestionType]);

  useEffect(() => {
    if (activeQuestionType) {
      handleQuestionTypeChange(activeQuestionType);
    }
  }, [activeQuestionType, handleQuestionTypeChange]);

  const handleConditionTypeChange = useCallback((selectedOption: any) => {
    setValue('conditionType', selectedOption?.value);
    setConditionType(selectedOption);
  }, [setValue, setConditionType]);

  useEffect(() => {
    if (activeConditionSelect) {
      handleConditionTypeChange(activeConditionSelect);
    }
  }, [activeConditionSelect, handleConditionTypeChange]);

  const handleLeafChange = useCallback((selectedOption: any) => {
    setValue('activeLeaf', selectedOption?.value);
    setActiveLeaf(selectedOption);
  }, [setValue, setActiveLeaf]);

  useEffect(() => {
    if (activeLeaf) {
      handleLeafChange(activeLeaf);
    }
  }, [activeLeaf, handleLeafChange]);

  const setMatchTextValue = (qOption: any) => {
    const matchText = qOption.value;
    setValue('matchText', matchText);
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
    setValue('matchText', activematchValue?.value);
  }, [setValue, activematchValue]);

  const [createQuestion, { loading: createLoading }] = useMutation(createQuestionMutation, {
    onCompleted: () => {
      if (onAddExpandChange) {
        onAddExpandChange(false);
      }
      onActiveQuestionChange(null);
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
    },
  });

  const [updateQuestion, { loading: updateLoading }] = useMutation(updateQuestionMutation, {
    onCompleted: () => {
      onActiveQuestionChange(null);
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
    },
  });

  const handleCancelQuestion = () => {
    if (question.id === '-1' && onAddExpandChange) {
      onAddExpandChange(false);
    }
    onActiveQuestionChange(null);
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
      prevOptions[optionIndex] = { value: value || '', publicValue: '' };
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
    const title = activeTitle;
    const type = activeQuestionType?.value;
    const overrideLeafId = activeLeaf?.value;
    const options = { options: activeOptions };
    const edgeCondition = activeCondition;
    console.log('form data: ', formData);
    if (question.id !== '-1') {
      updateQuestion({
        variables: {
          id,
          title,
          type,
          overrideLeafId: overrideLeafId || '',
          edgeId: edgeId || '-1',
          optionEntries: options,
          edgeCondition,
        },
      });
    } else {
      createQuestion({
        variables: {
          customerSlug,
          dialogueSlug,
          title,
          type,
          overrideLeafId: overrideLeafId || 'None',
          parentQuestionId,
          optionEntries: options,
          edgeCondition,
        },
      });
    }
  };

  const parentOptionsSelect = parentOptions?.map((option) => ({ label: option.value, value: option.value }));
  return (
    <FormContainer expandedForm>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Div py={4}>
          <FormSection id="general">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>About question</H3>
              <Muted color="gray.600">
                Tell us a bit about the question
              </Muted>
            </Div>
            <InputGrid>
              <FormControl isRequired isInvalid={!!errors.title?.message}>
                <FormLabel htmlFor="title">Title</FormLabel>
                <InputHelper>What is the question you want to ask?</InputHelper>
                <StyledInput
                  isInvalid={!!errors.title}
                  name="title"
                  defaultValue={activeTitle}
                  onBlur={(e) => setActiveTitle(e.currentTarget.value)}
                  ref={register({ required: true })}
                />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>
            </InputGrid>
          </FormSection>

          {parentQuestionType === 'Slider' && (
            <FormSection>
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>About condition</H3>
                <Muted color="gray.600">
                  When should this question be displayed
                </Muted>
              </Div>
              <Div>
                <InputGrid>
                  <FormControl isRequired isInvalid={!!errors.minValue}>
                    <FormLabel htmlFor="minValue">Min value</FormLabel>
                    <InputHelper>What is the minimal value to trigger this question?</InputHelper>
                    <StyledInput
                      isInvalid={!!errors.minValue}
                      name="minValue"
                      ref={register({ required: false })}
                      defaultValue={condition?.renderMin}
                      onBlur={(event: React.FocusEvent<HTMLInputElement>) => setMinValue(event)}
                    />
                    <FormErrorMessage>{errors.minValue?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.maxValue}>
                    <FormLabel htmlFor="maxValue">Max value</FormLabel>
                    <InputHelper>What is the maximal value to trigger this question?</InputHelper>
                    <StyledInput
                      isInvalid={!!errors.maxValue}
                      name="maxValue"
                      ref={register({ required: false })}
                      defaultValue={condition?.renderMax}
                      onChange={(event) => setMaxValue(event.target.value)}
                    />
                    <FormErrorMessage>{errors.maxValue?.message}</FormErrorMessage>
                  </FormControl>

                </InputGrid>
              </Div>
            </FormSection>
          )}

          {parentQuestionType === 'Choice' && (
            <FormSection>
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>About condition</H3>
                <Muted color="gray.600">
                  When should this question be displayed
                </Muted>
              </Div>
              <Div>
                <InputGrid>
                  <FormControl isRequired isInvalid={!!errors.matchText}>
                    <FormLabel htmlFor="matchText">Match value</FormLabel>
                    <InputHelper>What is the multi-choice question to trigger this question?</InputHelper>
                    <Select
                      styles={errors.matchText && !activematchValue ? ErrorStyle : undefined}
                      ref={() => register({
                        name: 'matchText',
                        required: false,
                      })}
                      options={parentOptionsSelect}
                      value={activematchValue}
                      onChange={(option: any) => {
                        setMatchTextValue(option);
                      }}
                    />
                    <FormErrorMessage>{errors.matchText?.message}</FormErrorMessage>
                  </FormControl>
                </InputGrid>
              </Div>
            </FormSection>
          )}

          <FormSection>
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>About type</H3>
              <Muted color="gray.600">
                Question details
              </Muted>
            </Div>
            <Div>
              <InputGrid>
                <FormControl isRequired isInvalid={!!errors.questionType}>
                  <FormLabel htmlFor="questionType">Question type</FormLabel>
                  <InputHelper>What is the type of the question?</InputHelper>
                  <Select
                    id="question-type-select"
                    isInvalid={!!errors.questionType}
                    ref={() => register({
                      name: 'questionType',
                      required: true,
                    })}
                    options={questionTypes}
                    value={activeQuestionType}
                    onChange={(qOption: any) => handleQuestionTypeChange(qOption)}
                  />
                  <FormErrorMessage>{errors.questionType?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.activeLeaf}>
                  <FormLabel htmlFor="questionType">Call-to-action</FormLabel>
                  <InputHelper>What CTA do you want to add?</InputHelper>
                  <Select
                    id="leaf-node-select"
                    isInvalid={!!errors.activeLeaf}
                    ref={() => register({
                      name: 'activeLeaf',
                      required: true,
                    })}
                    key={activeLeaf?.value}
                    options={leafs}
                    value={(activeLeaf?.value && activeLeaf) || leafs[0]}
                    onChange={(leafOption: any) => handleLeafChange(leafOption)}
                  />
                  <FormErrorMessage>{errors.activeLeaf?.message}</FormErrorMessage>
                </FormControl>
              </InputGrid>

              {activeQuestionType && activeQuestionType.value === 'CHOICE' && (
              <>
                <Div mb={1} gridColumn="1 / -1">
                  <Flex justifyContent="space-between">
                    <H4>
                      Options
                    </H4>
                    <PlusCircle data-cy="AddOption" style={{ cursor: 'pointer' }} onClick={() => addNewOption()} />
                  </Flex>

                  <Hr />
                </Div>

                {!activeOptions.length && !errors.options && <Muted>Please add an option </Muted>}
                {!activeOptions.length && errors.options && <Muted color="red">Please fill in at least one option!</Muted>}
                {activeOptions && activeOptions.map((option, optionIndex) => (
                  <Flex key={`${option.id}-${optionIndex}-${option.value}`} flexDirection="column">
                    <Flex my={1} flexDirection="row">
                      <Flex flexGrow={1}>
                        <StyledInput
                          isInvalid={errors.options && Array.isArray(errors.options) && !!errors.options?.[optionIndex]}
                          id={`options[${optionIndex}]`}
                          key={`input-${id}-${optionIndex}`}
                          name={`options[${optionIndex}]`}
                          ref={register(
                            { required: true,
                              minLength: 1 },
                          )}
                          defaultValue={option.value}
                          onChange={(e) => handleOptionChange(e.currentTarget.value, optionIndex)}
                        />
                      </Flex>

                      <DeleteQuestionOptionButtonContainer
                        onClick={(e) => deleteOption(e, optionIndex)}
                      >
                        <MinusCircle />
                      </DeleteQuestionOptionButtonContainer>
                    </Flex>
                    {errors.options?.[optionIndex] && <Muted color="warning">Please fill in a proper value!</Muted>}
                  </Flex>
                ))}
              </>
              )}
            </Div>
          </FormSection>
        </Div>

        <Div>
          <Flex>
            <Button
              isLoading={createLoading || updateLoading}
              isDisabled={!formState.isValid}
              variantColor="teal"
              type="submit"
            >
              Save

            </Button>
            <Button variant="outline" onClick={() => handleCancelQuestion()}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </FormContainer>

  );
};

export default QuestionEntryForm;
