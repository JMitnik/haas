import { Button, Div, H4, Hr, Muted, StyledInput, StyledLabel } from '@haas/ui';
import { DeleteQuestionOptionButtonContainer, QuestionEntryHeader } from 'views/DialogueBuilderView/QuestionEntry/QuestionEntryStyles';
import { MinusCircle, PlusCircle } from 'react-feather';
import { QuestionOptionProps } from 'views/DialogueBuilderView/TopicBuilderInterfaces';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import React, { useState } from 'react';
import Select from 'react-select';

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
  id: string;
  title: string;
  overrideLeaf: { label: string | undefined, value: string | undefined };
  isRoot: boolean;
  type: { label: string, value: string };
  options: Array<QuestionOptionProps>;
  leafs: Array<{ label: string, value: string }>;
}

const questionTypes = [
  { value: 'SLIDER', label: 'SLIDER' },
  { value: 'MULTI_CHOICE', label: 'MULTI_CHOICE' }];

const QuestionEntryForm = ({ id, title, overrideLeaf, isRoot, type, options, leafs }: QuestionEntryFormProps) => {
  const { register, handleSubmit, setValue, errors } = useForm<FormDataProps>({
    // validationSchema: schema,
  });
  const [activeTitle, setActiveTitle] = useState(title);
  const [activeRoot, setActiveRoot] = useState(isRoot);
  const [activeQuestionType, setActiveQuestionType] = useState(type);
  const [activeOptions, setActiveOptions] = useState(options);
  const [activeLeaf, setActiveLeaf] = useState(overrideLeaf);

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

  return (
    <Div backgroundColor="#daecfc">

      <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
        <StyledLabel>Title</StyledLabel>
        <StyledInput
          name="title"
          defaultValue={activeTitle}
          onBlur={(e) => setActiveTitle(e.currentTarget.value)}
          ref={register({ required: true })}
        />
        {errors.title && <Muted color="warning">Something went wrong!</Muted>}
      </Div>

      <Div useFlex pl={4} pr={4} pb={2} flexDirection="row">
        <StyledLabel>Is root:</StyledLabel>
        <input
          name="isGoing"
          type="checkbox"
          checked={activeRoot}
          onChange={() => setActiveRoot((prevRoot) => !prevRoot)}
        />
      </Div>

      <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
        <StyledLabel>Question type</StyledLabel>
        <Select
          options={questionTypes}
          value={activeQuestionType}
          onChange={(qOption: any) => setActiveQuestionType(qOption)}
        />
      </Div>

      {activeQuestionType && activeQuestionType.value === 'MULTI_CHOICE' && (
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <QuestionEntryHeader>
            OPTIONS (
            {activeOptions.length}
            {' '}
            option(s) selected)
          </QuestionEntryHeader>

          <Div>
            {((activeOptions && activeOptions.length === 0) || (!activeOptions)) && (
            <Div alignSelf="center">
              No options available...
            </Div>
            )}
            {activeOptions && activeOptions.map((option, optionIndex) => (
              <Div key={`${optionIndex}-${option.value}`} my={1} useFlex flexDirection="row">
                <StyledInput
                  key={optionIndex}
                  name={`${id}-option-${optionIndex}`}
                  defaultValue={option.value}
                  onBlur={(e) => handleOptionChange(e, optionIndex)}
                />
                <DeleteQuestionOptionButtonContainer
                  onClick={(e) => deleteOption(e, optionIndex)}
                >
                  <MinusCircle />
                </DeleteQuestionOptionButtonContainer>
              </Div>
            ))}
            <Button
              brand="default"
              mt={2}
              ml={4}
              mr={4}
              onClick={() => addNewOption()}
            >
              Add new option
            </Button>
            <Hr />
          </Div>
        </Div>
      )}

      <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
        <StyledLabel>Leaf node</StyledLabel>
        <Select
          options={leafs}
          value={(activeLeaf?.value && activeLeaf) || leafs[0]}
          onChange={(leafOption: any) => setActiveLeaf(leafOption)}
        />
      </Div>
    </Div>
  );
};

export default QuestionEntryForm;
