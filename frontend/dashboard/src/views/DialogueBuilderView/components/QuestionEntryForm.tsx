
import { ApolloError } from 'apollo-client';
import { MinusCircle, PlusCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import React, { useState } from 'react';
import Select from 'react-select';

import { Button, Div, Flex, Form, FormGroupContainer,
  Grid, H3, H4, Hr, Muted, StyledInput, StyledLabel } from '@haas/ui';
import {
  DeleteQuestionOptionButtonContainer,
} from 'views/DialogueBuilderView/components/QuestionEntry/QuestionEntryStyles';
import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import createQuestionMutation from 'mutations/createQuestion';
import updateQuestionMutation from 'mutations/updateQuestion';

import { EdgeConditonProps,
  OverrideLeafProps, QuestionEntryProps, QuestionOptionProps } from '../DialogueBuilderInterfaces';

interface FormDataProps {
  title: string;
  ctaType: string;
  url: string;
  linkType: string;
  tooltip?: string;
  icon: string;
  backgroundColor: string;
}

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
}

const questionTypes = [
  { value: 'SLIDER', label: 'Slider' },
  { value: 'MULTI_CHOICE', label: 'Multi-Choice' }];

const conditionTypes = [
  { value: 'match', label: 'match' },
  { value: 'valueBoundary', label: 'valueBoundary' }];

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
  edgeId,
  question,
  parentQuestionId,
}: QuestionEntryFormProps) => {
  const { customerSlug, dialogueSlug } = useParams();

  const { register, handleSubmit, setValue, errors } = useForm<FormDataProps>({
    // validationSchema: schema,
  });
  const [activeTitle, setActiveTitle] = useState(title);
  const [activeQuestionType, setActiveQuestionType] = useState(type);

  const [activeOptions, setActiveOptions] = useState(options);

  const matchValue = condition?.matchValue ? { label: condition.matchValue, value: condition.matchValue } : null;
  const [activematchValue, setActiveMatchValue] = useState<null | {label: string, value: string}>(matchValue);
  const [activeLeaf, setActiveLeaf] = useState({ label: overrideLeaf?.title, value: overrideLeaf?.id });
  const [activeConditionSelect, setActiveConditionSelect] = useState<null | { label: string, value: string}>(
    condition?.conditionType
      ? {
        value: condition.conditionType,
        label: condition.conditionType,
      } : null,
  );
  const [activeCondition, setActiveCondition] = useState<null | EdgeConditonProps>(condition || null);

  const [createQuestion] = useMutation(createQuestionMutation, {
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

  const [updateQuestion] = useMutation(updateQuestionMutation, {
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

  const setMatchTextValue = (qOption: any) => {
    const matchText = qOption.value;
    setActiveMatchValue(qOption);
    return setActiveCondition((prevCondition) => {
      if (!prevCondition) {
        return { matchValue: matchText };
      }
      prevCondition.matchValue = matchText;
      return prevCondition;
    });
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

  const setMaxValue = (event: React.FocusEvent<HTMLInputElement>) => {
    const maxValue = Number(event.target.value);
    return setActiveCondition((prevCondition) => {
      if (!prevCondition) {
        return { renderMax: maxValue };
      }
      prevCondition.renderMax = maxValue;
      return prevCondition;
    });
  };

  const setConditionType = (conditionOption: any) => {
    setActiveConditionSelect(conditionOption);
    setActiveCondition((prevCondition) => {
      if (!prevCondition) {
        return { conditionType: conditionOption.value };
      }
      prevCondition.conditionType = conditionOption.value;
      return prevCondition;
    });
  };

  const handleOptionChange = (event: any, optionIndex: number) => {
    const { value } = event.target;
    setActiveOptions((prevOptions) => {
      prevOptions[optionIndex] = { value, publicValue: '' };
      return [...prevOptions];
    });
  };

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
    if (question.id !== '-1') {
      updateQuestion({
        variables: {
          id,
          title,
          type,
          overrideLeafId: overrideLeafId || '',
          edgeId,
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
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroupContainer>
        <Grid gridTemplateColumns={['1fr', '1fr 2fr']} gridColumnGap={4}>
          <Div py={4} pr={4}>
            <H3 color="default.text" fontWeight={500} pb={2}>General question information</H3>
            <Muted>
              General information about the question, such as title, type, etc.
            </Muted>
          </Div>
          <Div py={4}>
            <Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
              <Div useFlex flexDirection="column">
                <StyledLabel>Title</StyledLabel>
                <StyledInput
                  name="title"
                  defaultValue={activeTitle}
                  onBlur={(e) => setActiveTitle(e.currentTarget.value)}
                  ref={register({ required: true })}
                />
                {errors.title && <Muted color="warning">Something went wrong!</Muted>}
              </Div>

              <Flex flexDirection="column">
                <StyledLabel>conditionType</StyledLabel>
                <Select
                  options={conditionTypes}
                  value={activeConditionSelect}
                  onChange={(qOption: any) => setConditionType(qOption)}
                />
              </Flex>
              {
              activeConditionSelect?.value === 'valueBoundary' && (
                <>
                  <Flex flexDirection="column">
                    <StyledLabel>Min value</StyledLabel>
                    <StyledInput
                      defaultValue={condition?.renderMin}
                      onBlur={(event: React.FocusEvent<HTMLInputElement>) => setMinValue(event)}
                    />
                  </Flex>
                  <Flex flexDirection="column">
                    <StyledLabel>Max value</StyledLabel>
                    <StyledInput
                      defaultValue={condition?.renderMax}
                      onBlur={(event: React.FocusEvent<HTMLInputElement>) => setMaxValue(event)}
                    />
                  </Flex>
                </>
              )
            }
              {
              activeConditionSelect?.value === 'match' && (
                <Div gridColumn="1 / -1">
                  <StyledLabel>Match value</StyledLabel>
                  <Select
                    options={parentOptionsSelect}
                    value={activematchValue}
                    onChange={(option: any) => {
                      setMatchTextValue(option);
                    }}
                  />
                </Div>
              )
            }

              <Div useFlex flexDirection="column">
                <StyledLabel>Question type</StyledLabel>
                <Select
                  options={questionTypes}
                  value={activeQuestionType}
                  onChange={(qOption: any) => setActiveQuestionType(qOption)}
                />
              </Div>

              <Div key={activeLeaf?.value} useFlex flexDirection="column">
                <StyledLabel>Leaf node</StyledLabel>
                <Select
                  key={activeLeaf?.value}
                  options={leafs}
                  value={(activeLeaf?.value && activeLeaf) || leafs[0]}
                  onChange={(leafOption: any) => setActiveLeaf(leafOption)}
                />
              </Div>

              {activeQuestionType && activeQuestionType.value === 'MULTI_CHOICE' && (
                <>
                  <Div mb={1} gridColumn="1 / -1">
                    <Flex justifyContent="space-between">
                      <H4>
                        Options
                      </H4>
                      <PlusCircle style={{ cursor: 'pointer' }} onClick={() => addNewOption()} />
                    </Flex>

                    <Hr />
                  </Div>

                    {((activeOptions && activeOptions.length === 0) || (!activeOptions)) && (
                    <Div alignSelf="center">
                      No options available...
                    </Div>
                    )}
                    {activeOptions && activeOptions.map((option, optionIndex) => (
                      <Flex key={`${option.id}-${optionIndex}-${option.value}`} my={1} flexDirection="row">
                        <StyledInput
                          key={`input-${id}-${optionIndex}`}
                          name={`${id}-option-${optionIndex}`}
                          defaultValue={option.value}
                          onBlur={(e) => handleOptionChange(e, optionIndex)}
                        />
                        <DeleteQuestionOptionButtonContainer
                          onClick={(e) => deleteOption(e, optionIndex)}
                        >
                          <MinusCircle />
                        </DeleteQuestionOptionButtonContainer>
                      </Flex>
                    ))}
                </>
              )}
            </Grid>
          </Div>
        </Grid>
      </FormGroupContainer>

      <Div>
        <Flex>
          <Button brand="primary" mr={2} type="submit">Save Question</Button>
          <Button brand="default" type="button" onClick={() => handleCancelQuestion()}>Cancel</Button>
        </Flex>
      </Div>
    </Form>

  );
};

export default QuestionEntryForm;
