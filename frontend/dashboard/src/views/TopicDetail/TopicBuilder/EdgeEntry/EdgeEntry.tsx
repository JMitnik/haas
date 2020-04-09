import React, { useState } from 'react';
import { X } from 'react-feather';
import { Div, StyledInput, StyledLabel, DeleteButtonContainer } from '@haas/ui';
import Select from 'react-select';
import { QuestionEntryProps, EdgeChildProps } from './EdgeEntryInterfaces';

const conditionTypes = [
  { value: 'match', label: 'match' },
  { value: 'valueBoundary', label: 'valueBoundary' }];

const EdgeEntry = (
  { questions, edge, index, setActiveEdges,
    setConditionType, setChildQuestionNode, setEdgeConditionMinValue,
    setEdgeConditionMaxValue, setEdgeConditionMatchValue }:
  {
    questions: Array<QuestionEntryProps>, edge: EdgeChildProps,
    index: number, setActiveEdges: React.Dispatch<React.SetStateAction<EdgeChildProps[]>>,
    setConditionType: Function, setChildQuestionNode: Function, setEdgeConditionMinValue: Function,
    setEdgeConditionMaxValue: Function, setEdgeConditionMatchValue: Function
  },
) => {
  const [activeCondition, setactiveCondition] = useState(
    { value: edge?.conditions?.[0]?.conditionType,
      label: edge?.conditions?.[0]?.conditionType },
  );

  const [activeChildQuestion, setactiveChildQuestion] = useState(
    { value: edge?.childNode?.id,
      label: `${edge?.childNode?.title} - ${edge?.childNode?.id}` },
  );

  const setCondition = (qOption: any) => {
    const { label, value } = qOption;
    setactiveCondition({ label, value });
    setConditionType(value, index);
  };

  const setChildQuestion = (childQuestion: any) => {
    const { label, value }: { label: string, value: string } = childQuestion;
    const strippedLabel = label.split('-')?.[0]?.trim();
    setactiveChildQuestion({ label, value });
    setChildQuestionNode({ title: strippedLabel, id: value }, index);
  };

  const setMinValue = (event: React.FocusEvent<HTMLInputElement>) => {
    const minValue = Number(event.target.value);
    setEdgeConditionMinValue(minValue, index);
  };

  const setMaxValue = (event: React.FocusEvent<HTMLInputElement>) => {
    const maxValue = Number(event.target.value);
    setEdgeConditionMaxValue(maxValue, index);
  };

  const newSelect = questions.map((question) => {
    const label = `${question.title} - ${question.id}`;
    const value = question.id;
    return { label, value };
  });

  const deleteEdgeEntry = (event: any, edgeIndex: number) => {
    event.preventDefault();

    setActiveEdges((edges) => {
      edges.splice(edgeIndex, 1);
      return [...edges];
    });
  };

  return (
    <Div position="relative">
      <Div useFlex my={10} flexDirection="column" backgroundColor="#f5f5f5">
        <DeleteButtonContainer
          onClick={(e) => deleteEdgeEntry(e, index)}
        >
          <X />
        </DeleteButtonContainer>
        <StyledLabel marginTop={10} marginBottom={20}>
          Child node #
          {index + 1}
        </StyledLabel>
        <Select
          options={newSelect}
          value={activeChildQuestion}
          onChange={(childNode) => setChildQuestion(childNode)}
        />
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
                <StyledInput
                  defaultValue={edge?.conditions?.[0].matchValue}
                  onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                    setEdgeConditionMatchValue(event.target.value, index);
                  }}
                />
              </Div>
            )
          }
        </Div>
      </Div>
    </Div>
  );
};

export default EdgeEntry;
