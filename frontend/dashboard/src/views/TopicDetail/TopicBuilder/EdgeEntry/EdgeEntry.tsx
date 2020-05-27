import React, { useState } from 'react';
import { X } from 'react-feather';
import { Div, StyledInput, StyledLabel, DeleteButtonContainer } from '@haas/ui';
import Select from 'react-select';
import { QuestionEntryProps, EdgeChildProps } from '../TopicBuilderInterfaces';
import QuestionEntry from '../QuestionEntry/QuestionEntry';

const conditionTypes = [
  { value: 'match', label: 'match' },
  { value: 'valueBoundary', label: 'valueBoundary' }];

interface EdgeEntryItemProps {
  questions: Array<QuestionEntryProps>;
  edge: EdgeChildProps;
  question: QuestionEntryProps;
  // TODO: Use right type for leafs;
  leafs: any;
  index: number;
  activeExpanded: Array<any>;
  onAddQuestion: (event: any, questionUUID: string) => void;
  onDeleteQuestion: (event: any, questionId: string) => void;
  setActiveExpanded: (newExpanded: any) => void;
  deleteEdgeEntry: (event: any, edgeIndex: number) => void;
  setConditionType: (conditionType: string, edgeIndex: number) => void;
  setEdgeConditionMinValue: (renderMin: number, edgeIndex: number) => void;
  setEdgeConditionMaxValue: (renderMax: number, edgeIndex: number) => void;
  setEdgeConditionMatchValue: (matchValue: string, edgeIndex: number) => void;
  onTitleChange: (newTitle: string, questionId: string) => void;
  onLeafNodeChange: (leaf: any, questionId: string) => void;
  onQuestionTypeChange: (value: string, questionId: string) => void;
  onQuestionOptionsChange: (value: Array<any>, questionId: string) => void;
  onAddQuestionOption: (value: Array<any>, questionId: string) => void;
  onEdgesChange: (edges: Array<EdgeChildProps>, questionId: string) => void;
  onIsRootQuestionChange: (isRoot: boolean, questionId: string) => void;
  onQuestionExpandChange: (question: any) => void;
}

const EdgeEntry = (
  { edge, index, questions, question, ...props }:
    EdgeEntryItemProps,
) => {
  // TODO: Remove these states and use parent state
  const [activeCondition, setactiveCondition] = useState(
    {
      value: edge?.conditions?.[0]?.conditionType,
      label: edge?.conditions?.[0]?.conditionType,
    },
  );

  const respectiveQuestion = questions.filter((question) => {
    return question.id === edge.childNode.id
  })

  const [edgeExpanded, setEdgeExpanded] = useState(false);

  const setCondition = (qOption: any) => {
    const { label, value } = qOption;
    setactiveCondition({ label, value });
    props.setConditionType(value, index);
  };


  const setMinValue = (event: React.FocusEvent<HTMLInputElement>) => {
    const minValue = Number(event.target.value);
    props.setEdgeConditionMinValue(minValue, index);
  };

  const setMaxValue = (event: React.FocusEvent<HTMLInputElement>) => {
    const maxValue = Number(event.target.value);
    props.setEdgeConditionMaxValue(maxValue, index);
  };

  const expandEdge = () => {
    setEdgeExpanded(!edgeExpanded);
    if (respectiveQuestion[0]) {
      props.onQuestionExpandChange(respectiveQuestion[0].id);
    }
  }

  const newOptionsSelect = question.options?.map((option) => {
    return { label: option.value, value: option.value };
  })

  return (
    <Div position="relative">
      <Div useFlex my={10} flexDirection="column" backgroundColor="#f5f5f5">
        <DeleteButtonContainer
          onClick={(e) => props.deleteEdgeEntry(e, index)}
        >
          <X />
        </DeleteButtonContainer>
        <StyledLabel style={{ 'cursor': 'pointer', 'padding': '5px' }} onClick={() => expandEdge()} marginBottom={20}>
          Child node #
          {index + 1}
          -
          {respectiveQuestion[0] ? respectiveQuestion[0].title : '(no child question selected)'}
        </StyledLabel>
        {edgeExpanded && <Div>

          <Div mt={10} mb={20}>
            <StyledLabel>conditionType</StyledLabel>
            {
              // TODO: Clear fields when condition type is changed?
            }
            <Select
              options={conditionTypes}
              value={activeCondition}
              onChange={(qOption) => setCondition(qOption)}
            />
            {
              activeCondition.value === 'valueBoundary' && (
                <Div mt={10}>
                  <StyledLabel ml={5} mr={5}>Min value</StyledLabel>
                  <StyledInput
                    defaultValue={edge?.conditions?.[0].renderMin}
                    onBlur={(event: React.FocusEvent<HTMLInputElement>) => setMinValue(event)}
                  />
                  <StyledLabel ml={5} mr={5}>Max value</StyledLabel>
                  <StyledInput
                    defaultValue={edge?.conditions?.[0].renderMax}
                    onBlur={(event: React.FocusEvent<HTMLInputElement>) => setMaxValue(event)}
                  />
                </Div>
              )
            }
            {
              activeCondition.value === 'match' && (
                <Div mt={10}>
                  <StyledLabel ml={5} mr={5}>Match value</StyledLabel>
                  <Select
                    options={newOptionsSelect}
                    value={{ label: edge?.conditions?.[0].matchValue, value: edge?.conditions?.[0].matchValue }}
                    onChange={(option: any) => {
                      props.setEdgeConditionMatchValue(option.value, index);
                    }}
                  />
                </Div>
              )
            }

            {
              respectiveQuestion[0] && <QuestionEntry
                onAddQuestion={props.onAddQuestion}
                onDeleteQuestion={props.onDeleteQuestion}
                onQuestionExpandChange={props.onQuestionExpandChange}
                activeExpanded={props.activeExpanded}
                setActiveExpanded={props.setActiveExpanded}
                onIsRootQuestionChange={props.onIsRootQuestionChange}
                onLeafNodeChange={props.onLeafNodeChange}
                onEdgesChange={props.onEdgesChange}
                onAddQuestionOption={props.onAddQuestionOption}
                onQuestionOptionsChange={props.onQuestionOptionsChange}
                onQuestionTypeChange={props.onQuestionTypeChange}
                onTitleChange={props.onTitleChange}
                key={index}
                index={index}
                questionsQ={questions}
                question={respectiveQuestion[0]}
                leafs={props.leafs}
              />
            }

          </Div>
        </Div>
        }
      </Div>

    </Div>
  );
};

export default EdgeEntry;
