import React, { useState } from 'react';
import { X, Plus } from 'react-feather';
import { Div, StyledInput, StyledLabel, DeleteButtonContainer } from '@haas/ui';
import Select from 'react-select';
import { QuestionEntryProps, EdgeChildProps } from '../TopicBuilderInterfaces';
import QuestionEntry from '../QuestionEntry/QuestionEntry';

const conditionTypes = [
  { value: 'match', label: 'match' },
  { value: 'valueBoundary', label: 'valueBoundary' }];

const EdgeEntry = (
  { questions, leafs, edge, index, deleteEdgeEntry, onTitleChange, onLeafNodeChange, onQuestionOptionsChange,
    setConditionType, setChildQuestionNode, setEdgeConditionMinValue, onQuestionTypeChange, onDeleteQuestion,
    setEdgeConditionMaxValue, setEdgeConditionMatchValue, question, setActiveExpanded, onAddQuestion,
    onAddQuestionOption, onEdgesChange, onIsRootQuestionChange, activeExpanded, onQuestionExpandChange }:
    {
      activeExpanded: Array<string>, setActiveExpanded: (newExpanded: any) => void, onTitleChange: (newTitle: string, questionId: string) => void,
      onLeafNodeChange: (leaf: any, questionId: string) => void, onEdgesChange: (edges: Array<EdgeChildProps>, questionId: string) => void,
      question: QuestionEntryProps, questions: Array<QuestionEntryProps>, edge: EdgeChildProps, onDeleteQuestion: (event: any, questionId: string) => void,
      onIsRootQuestionChange: (isRoot: boolean, questionId: string) => void, onQuestionExpandChange: (question: any) => void,
      index: number, deleteEdgeEntry: Function, onQuestionTypeChange: (value: string, questionId: string) => void,
      onQuestionOptionsChange: (value: Array<any>, questionId: string) => void, leafs: any, onAddQuestion: (event: any, questionUUID: string) => void,
      setConditionType: Function, setChildQuestionNode: Function, setEdgeConditionMinValue: Function,
      setEdgeConditionMaxValue: Function, setEdgeConditionMatchValue: Function, onAddQuestionOption: (value: Array<any>, questionId: string) => void
    },
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
    setConditionType(value, index);
  };


  const setMinValue = (event: React.FocusEvent<HTMLInputElement>) => {
    const minValue = Number(event.target.value);
    setEdgeConditionMinValue(minValue, index);
  };

  const setMaxValue = (event: React.FocusEvent<HTMLInputElement>) => {
    const maxValue = Number(event.target.value);
    setEdgeConditionMaxValue(maxValue, index);
  };

  const expandEdge = () => {
    setEdgeExpanded(!edgeExpanded);
    if (respectiveQuestion[0]) {
      onQuestionExpandChange(respectiveQuestion[0].id);
    }
  }

  const newOptionsSelect = question.options?.map((option) => {
    return { label: option.value, value: option.value };
  })

  return (
    <Div position="relative">
      <Div useFlex my={10} flexDirection="column" backgroundColor="#f5f5f5">
        <DeleteButtonContainer
          onClick={(e) => deleteEdgeEntry(e, index)}
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
                      console.log(option);
                      setEdgeConditionMatchValue(option.value, index);
                    }}
                  />
                </Div>
              )
            }
            {/* <Div mt={2}>
              <Select
                options={[{ value: 'Existing question', label: 'Existing question' }, { value: 'New question', label: 'New question' }]}
                value={{ value: edgeQuestionType, label: edgeQuestionType }}
                onChange={(qOption) => handleEdgeQuestionType(qOption)}
              />
            </Div>

            {
              edgeQuestionType === 'Existing question' &&
              <Div mt={2}>
                <Select
                  options={newSelect}
                  value={activeChildQuestion}
                  onChange={(childNode) => handleExistingQuestion(childNode)}
                />
              </Div>  
            } */}

            {
              respectiveQuestion[0] && <QuestionEntry
                onAddQuestion={onAddQuestion}
                onDeleteQuestion={onDeleteQuestion}
                onQuestionExpandChange={onQuestionExpandChange}
                activeExpanded={activeExpanded}
                setActiveExpanded={setActiveExpanded}
                onIsRootQuestionChange={onIsRootQuestionChange}
                onLeafNodeChange={onLeafNodeChange}
                onEdgesChange={onEdgesChange}
                onAddQuestionOption={onAddQuestionOption}
                onQuestionOptionsChange={onQuestionOptionsChange}
                onQuestionTypeChange={onQuestionTypeChange}
                onTitleChange={onTitleChange}
                key={index}
                index={index}
                questionsQ={questions}
                question={respectiveQuestion[0]}
                leafs={leafs}
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
