/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { MinusCircle } from 'react-feather';
import { Muted, Div, H4, Button } from '@haas/ui';
import styled, { css } from 'styled-components/macro';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import EdgeEntry from '../EdgeEntry/EdgeEntry';

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
const QuestionEntryView = styled.div`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Hr = styled.hr`
  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.default.light};
  `}
`;

const DeleteQuestionOptionButtonContainer = styled.button`
  background: none;
  border: none;
  opacity: 0.1;
  cursor: pointer;
  transition: all 0.2s ease-in;
  margin-left: 1%;

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

const questionTypes = [{ value: 'SLIDER', label: 'SLIDER' }, { value: 'MULTI_CHOICE', label: 'MULTI_CHOICE' }];

const QuestionEntry = ({ questionsQ, question, leafs, index, onTitleChange, onIsRootQuestionChange, onLeafNodeChange, onQuestionTypeChange, onQuestionOptionsChange, onAddQuestionOption, onEdgesChange }: { questionsQ: Array<QuestionEntryProps>, question: QuestionEntryProps, leafs: any, index: number, onTitleChange: Function, onLeafNodeChange: Function, onQuestionTypeChange: Function, onQuestionOptionsChange: Function, onAddQuestionOption: Function, onEdgesChange: Function, onIsRootQuestionChange: Function }) => {
  const { register, errors } = useForm();

  const [activeTitle, setActiveTitle] = useState(question.title);
  const [currLeaf, setCurrLeaf] = useState({ label: question.overrideLeaf?.title, value: question.overrideLeaf?.id });
  const [currQuestionType, setCurrQuestionType] = useState({ label: question.questionType, value: question.questionType });
  const [currOptions, setCurrOptions] = useState(question?.options || []);
  const [currEdges, setCurrEdges] = useState(question?.edgeChildren || []);
  const [isRoot, setIsRoot] = useState(question?.isRoot);
  const isIntialRender = useRef(true);

  const setNewTitle = (event: any, qIndex: number) => {
    event.preventDefault();
    const newTitle = event.target.value;
    onTitleChange(newTitle, qIndex);
    setActiveTitle(newTitle);
  };

  const setQuestionType = (questionType: any) => {
    const { label, value } = questionType;
    setCurrQuestionType({ label, value });
    onQuestionTypeChange(value, index);
  };

  const setLeafNode = (leafNode: any) => {
    const { label, value } = leafNode;
    setCurrLeaf({ label, value });
    // TODO: Set new leaf
    onLeafNodeChange(value, index);
  };

  const setIsRootQuestion = () => {
    onIsRootQuestionChange(!isRoot, index);
    setIsRoot(!isRoot);
  };

  const addNewOption = (event: any, qIndex: number) => {
    event.preventDefault();

    const value = '';
    const publicValue = '';

    setCurrOptions((options) => [...options, { value, publicValue }]);
    onAddQuestionOption(currOptions, qIndex);
  };

  const setConditionType = (conditionType: string, edgeIndex: number) => {
    setCurrEdges((edgesPrev: Array<EdgeChildProps>) => {
      const edge: EdgeChildProps = edgesPrev[edgeIndex];
      if (edge.conditions.length === 0) {
        edge.conditions = [{ conditionType }];
        return [...edgesPrev];
      }

      edge.conditions[0].conditionType = conditionType;
      return [...edgesPrev];
    });
  };

  const setChildQuestionNode = (childNode: any, edgeIndex: number) => {
    setCurrEdges((edgesPrev: Array<EdgeChildProps>) => {
      let edge: EdgeChildProps = edgesPrev[edgeIndex];
      if (!edge) {
        edge = { childNode, conditions: [], parentNode: {} };
        return [...edgesPrev];
      }

      edge.childNode = childNode;
      return [...edgesPrev];
    });
  };

  const setEdgeConditionMinValue = (renderMin: number, edgeIndex: number) => {
    setCurrEdges((edgesPrev: Array<EdgeChildProps>) => {
      const edge: EdgeChildProps = edgesPrev[edgeIndex];
      if (edge?.conditions?.length === 0) {
        edge.conditions = [{ renderMin }];
        return [...edgesPrev];
      }

      edge.conditions[0].renderMin = renderMin;
      return [...edgesPrev];
    });
  };

  const setEdgeConditionMaxValue = (renderMax: number, edgeIndex: number) => {
    setCurrEdges((edgesPrev: Array<EdgeChildProps>) => {
      const edge: EdgeChildProps = edgesPrev[edgeIndex];
      if (edge?.conditions?.length === 0) {
        edge.conditions = [{ renderMax }];
        return [...edgesPrev];
      }

      edge.conditions[0].renderMax = renderMax;
      return [...edgesPrev];
    });
  };

  const setEdgeConditionMatchValue = (matchValue: string, edgeIndex: number) => {
    setCurrEdges((edgesPrev: Array<EdgeChildProps>) => {
      const edge: EdgeChildProps = edgesPrev[edgeIndex];
      if (edge?.conditions?.length === 0) {
        edge.conditions = [{ matchValue }];
        return [...edgesPrev];
      }

      edge.conditions[0].matchValue = matchValue;
      return [...edgesPrev];
    });
  };

  useEffect(() => {
    if (isIntialRender.current === true) {
      isIntialRender.current = false;
      return;
    }

    onEdgesChange(currEdges, index);
  }, [currEdges, isIntialRender]);

  const addNewEdge = (event: any) => {
    event.preventDefault();
    setCurrEdges((edges: Array<EdgeChildProps>) => [...edges, {
      id: undefined,
      conditions: [],
      parentNode: { id: question.id, title: question.title },
      childNode: {},
    }]);
  };

  const deleteOption = (event: any, questionIndex: number, optionIndex: number) => {
    event.preventDefault();
    setCurrOptions((options) => {
      options.splice(optionIndex, 1);
      return [...options];
    });
    onQuestionOptionsChange(currOptions, questionIndex);
  };

  const setOption = (event: any, questionIndex: number, optionIndex: number) => {
    event.preventDefault();
    const { value } = event.target;
    setCurrOptions((options) => {
      options[optionIndex] = { value, publicValue: '' };
      return [...options];
    });

    onQuestionOptionsChange(currOptions, questionIndex);
  };

  return (
    <QuestionEntryView>
      <Div backgroundColor="#daecfc" margin={5} py={6}>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <H4>
            Question:
            {question.id}
          </H4>
          <StyledLabel>Title</StyledLabel>
          <StyledInput name="title" defaultValue={activeTitle} onBlur={(e) => setNewTitle(e, index)} ref={register({ required: true })} />
          {errors.title && <Muted color="warning">Something went wrong!</Muted>}
        </Div>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="row">
          <StyledLabel>Is root:</StyledLabel>
          <input
            name="isGoing"
            type="checkbox"
            checked={question.isRoot}
            onChange={() => setIsRootQuestion()}
          />
        </Div>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <StyledLabel>Question type</StyledLabel>
          <Select options={questionTypes} value={currQuestionType} onChange={(qOption) => setQuestionType(qOption)} />
        </Div>
        {currQuestionType.value === 'MULTI_CHOICE' && (
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <H4>OPTIONS</H4>
          {
            ((currOptions && currOptions.length === 0) || (!currOptions)) && (
            <Div alignSelf="center">
              No options available...
            </Div>
            )
          }
          {
                            currOptions && currOptions.map((option, optionIndex) => (
                              <Div key={`${optionIndex}-${option.value}`} my={1} useFlex flexDirection="row">
                                <StyledInput key={optionIndex} name={`${question.id}-option-${optionIndex}`} defaultValue={option.value} onBlur={(e) => setOption(e, index, optionIndex)} />
                                <DeleteQuestionOptionButtonContainer onClick={(e) => deleteOption(e, index, optionIndex)}>
                                  {' '}
                                  <MinusCircle />
                                  {' '}
                                </DeleteQuestionOptionButtonContainer>
                              </Div>
                            ))
                        }
          <Hr />
          <Button brand="default" mt={2} ml={4} mr={4} onClick={(e) => addNewOption(e, index)}>Add new option</Button>
        </Div>
        )}
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <StyledLabel>Leaf node</StyledLabel>
          <Select options={leafs} value={(currLeaf?.value && currLeaf) || leafs[0]} onChange={(leafOption) => setLeafNode(leafOption)} />
        </Div>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <H4>Edges</H4>
          {
                        ((currEdges && currEdges.length === 0) || (!currEdges)) && (
                        <Div alignSelf="center">
                          No edges available...
                        </Div>
                        )
                    }
          {
                        currEdges && currEdges.map((edge: EdgeChildProps, edgeIndex: number) => <EdgeEntry setEdgeConditionMatchValue={setEdgeConditionMatchValue} setEdgeConditionMaxValue={setEdgeConditionMaxValue} setEdgeConditionMinValue={setEdgeConditionMinValue} setChildQuestionNode={setChildQuestionNode} setConditionType={setConditionType} key={`${edgeIndex}-${edge.id}`} setCurrEdges={setCurrEdges} questions={questionsQ} edge={edge} index={edgeIndex} />)
                    }
          <Button brand="default" mt={2} ml={4} mr={4} onClick={(e) => addNewEdge(e)}>Add new edge</Button>
        </Div>
      </Div>
    </QuestionEntryView>
  );
};

export default QuestionEntry;
