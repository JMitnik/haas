/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import { X } from 'react-feather';
import { Div } from '@haas/ui';
import styled, { css } from 'styled-components/macro';
import Select from 'react-select';

interface OverrideLeafProps {
  id?: string;
  type?: string;
  title?: string;
}
interface QuestionEntryProps {
  id?: string;
  title?: string;
  isRoot?: boolean;
  questionType?: string;
  overrideLeaf?: OverrideLeafProps;
  edgeChildren?: Array<EdgeChildProps>;
  options?: Array<QuestionOptionProps>;
}

interface QuestionOptionProps {
  id?: string;
  value: string;
  publicValue?: string;
}

interface EdgeChildProps {
  id?: string;
  conditions: Array<EdgeConditonProps>;
  parentNode: QuestionEntryProps;
  childNode: QuestionEntryProps;
}

interface EdgeConditonProps {
  id?: string;
  conditionType?: string;
  renderMin?: number;
  renderMax?: number;
  matchValue?: string;
}

const DeleteCustomerButtonContainer = styled.button`
  position: absolute;
  top: 10px;
  right: 0px;
  background: none;
  border: none;
  opacity: 0.1;
  cursor: pointer;
  transition: all 0.2s ease-in;

  &:hover {
    transition: all 0.2s ease-in;
    opacity: 0.8;
  }
`;

const StyledLabel = styled(Div).attrs({ as: 'label' })`
  ${({ theme }) => css`
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 2px;
    display: inline-block;
    color: ${theme.colors.default.dark}
    text-transform: uppercase;
  `}
`;

const StyledInput = styled.input`
  ${({ theme }) => css`
    border-radius: ${theme.borderRadiuses.sm};
    background: ${theme.colors.white};
    border: none;
    border-bottom: ${theme.colors.default.normal} 1px solid;
    box-shadow: none;
    background: white;
    border-radius: 3px;

    /* Make somehow a color */
    border: 1px solid #dbdde0;
    box-shadow: none;

    /* Set to variable */
    padding: 15px;
  `}
`;

const conditionTypes = [{ value: 'match', label: 'match' }, { value: 'valueBoundary', label: 'valueBoundary' }];

const EdgeEntry = ({ questions, edge, index, setCurrEdges, setConditionType, setChildQuestionNode, setEdgeConditionMinValue, setEdgeConditionMaxValue, setEdgeConditionMatchValue }: {
  questions: Array<QuestionEntryProps>, edge: EdgeChildProps, index: number, setCurrEdges: React.Dispatch<React.SetStateAction<EdgeChildProps[]>>,
  setConditionType: Function, setChildQuestionNode: Function, setEdgeConditionMinValue: Function, setEdgeConditionMaxValue: Function, setEdgeConditionMatchValue: Function
}) => {
  const [currCondition, setCurrCondition] = useState({ value: edge?.conditions?.[0]?.conditionType, label: edge?.conditions?.[0]?.conditionType });
  const [currChildQuestion, setCurrChildQuestion] = useState({ value: edge?.childNode?.id, label: `${edge?.childNode?.title} - ${edge?.childNode?.id}` });

  const setCondition = (qOption: any) => {
    const { label, value } = qOption;
    setCurrCondition({ label, value });
    setConditionType(value, index);
  };

  const setChildQuestion = (childQuestion: any) => {
    const { label, value }: { label: string, value: string } = childQuestion;
    const strippedLabel = label.split('-')?.[0]?.trim();
    setCurrChildQuestion({ label, value });
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

    setCurrEdges((edges) => {
      edges.splice(edgeIndex, 1);
      return [...edges];
    });
  };

  return (
    <Div position="relative">
      <Div useFlex my={10} flexDirection="column" backgroundColor="#f5f5f5">
        <DeleteCustomerButtonContainer onClick={(e) => deleteEdgeEntry(e, index)}><X /></DeleteCustomerButtonContainer>
        <StyledLabel marginTop={10} marginBottom={20}>Child node #{index + 1}</StyledLabel>
        <Select options={newSelect} value={currChildQuestion} onChange={(childNode) => setChildQuestion(childNode)} />
        <Div mt={10} mb={20}>
          <StyledLabel>conditionType</StyledLabel>
          {
                        // TODO: Clear fields when condition type is changed?
                    }
          <Select options={conditionTypes} value={currCondition} onChange={(qOption) => setCondition(qOption)} />
          {
                        currCondition.value === 'valueBoundary' && (
                        <Div mt={10}>
                          <StyledLabel ml={5} mr={5}>Min value</StyledLabel>
                          <StyledInput defaultValue={edge?.conditions?.[0].renderMin} onBlur={(event: React.FocusEvent<HTMLInputElement>) => setMinValue(event)} />
                          <StyledLabel ml={5} mr={5}>Max value</StyledLabel>
                          <StyledInput defaultValue={edge?.conditions?.[0].renderMax} onBlur={(event: React.FocusEvent<HTMLInputElement>) => setMaxValue(event)} />
                        </Div>
                        )
                    }
          {
                        currCondition.value === 'match' && (
                        <Div mt={10}>
                          <StyledLabel ml={5} mr={5}>Match value</StyledLabel>
                          <StyledInput defaultValue={edge?.conditions?.[0].matchValue} onBlur={(event: React.FocusEvent<HTMLInputElement>) => setEdgeConditionMatchValue(event.target.value, index)} />
                        </Div>
                        )
                    }
        </Div>
      </Div>
    </Div>
  );
};

export default EdgeEntry;
