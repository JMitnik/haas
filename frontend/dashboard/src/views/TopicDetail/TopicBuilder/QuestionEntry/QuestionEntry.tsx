/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { MinusCircle } from 'react-feather';
import { Muted, Div, H4, Button, StyledLabel, StyledInput, Hr, DeleteButtonContainer } from '@haas/ui';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import EdgeEntry from '../EdgeEntry/EdgeEntry';
import { QuestionEntryContainer } from './QuestionEntryStyles';

interface OverrideLeafProps {
  id?: string;
  type?: string;
  title?: string;
}
interface QuestionEntryProps {
  id?: string;
  title?: string;
  isRoot?: boolean;
  type?: string;
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

const questionTypes = [{ value: 'SLIDER', label: 'SLIDER' }, { value: 'MULTI_CHOICE', label: 'MULTI_CHOICE' }];

interface QuestionEntryItemProps {
  questionsQ: Array<QuestionEntryProps>;
  question: QuestionEntryProps;
  // TODO: Use right type for leafs;
  leafs: any;
  index: number;
  // TODO: Define function type, ala () => void or whatever
  onTitleChange: (newTitle: string, index: number) => void;
  onLeafNodeChange: (value: any, index: number) => void;
  onQuestionTypeChange: (value: any, index: number) => void;
  onQuestionOptionsChange: (options: any[], index: number) => void;
  onAddQuestionOption: (options: any[], index: number) => void;
  onEdgesChange: (edges: any[], index: number) => void;
  onIsRootQuestionChange: (isRoot: boolean, index: number) => void;
}

const QuestionEntryItem = ({ question, leafs, questionsQ, onEdgesChange, index, ...props }: QuestionEntryItemProps) => {
  const { register, errors } = useForm();

  // TODO: What is difference between eustion and questionsQ? <- Not clear

  const [activeTitle, setActiveTitle] = useState(() => question.title);
  const [activeLeaf, setActiveLeaf] = useState(() => ({ label: question.overrideLeaf?.title, value: question.overrideLeaf?.id }));
  const [activeQuestionType, setActiveQuestionType] = useState(() => ({ label: question.type, value: question.type }));
  const [activeOptions, setActiveOptions] = useState(() => question?.options || []);
  const [activeEdges, setActiveEdges] = useState(() => question?.edgeChildren || []);
  const [isRoot, setIsRoot] = useState(() => question?.isRoot);
  const isIntialRender = useRef(true);

  const setNewTitle = (event: any, qIndex: number) => {
    event.preventDefault();
    const newTitle = event.target.value;
    props.onTitleChange(newTitle, qIndex);
    setActiveTitle(newTitle);
  };

  const setQuestionType = (questionType: any) => {
    const { label, value } = questionType;
    setActiveQuestionType({ label, value });
    props.onQuestionTypeChange(value, index);
  };

  const setLeafNode = (leafNode: any) => {
    const { label, value } = leafNode;
    setActiveLeaf({ label, value });
    props?.onLeafNodeChange(value, index);
  };

  const setIsRootQuestion = () => {
    props?.onIsRootQuestionChange(!isRoot, index);
    setIsRoot(!isRoot);
  };

  const addNewOption = (event: any, qIndex: number) => {
    event.preventDefault();

    const value = '';
    const publicValue = '';

    setActiveOptions((options) => [...options, { value, publicValue }]);
    props.onAddQuestionOption(activeOptions, qIndex);
  };

  const setConditionType = (conditionType: string, edgeIndex: number) => {
    setActiveEdges((edgesPrev: Array<EdgeChildProps>) => {
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
    setActiveEdges((edgesPrev: Array<EdgeChildProps>) => {
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
    setActiveEdges((edgesPrev: Array<EdgeChildProps>) => {
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
    setActiveEdges((edgesPrev: Array<EdgeChildProps>) => {
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
    setActiveEdges((edgesPrev: Array<EdgeChildProps>) => {
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

    onEdgesChange(activeEdges, index);
    // TODO: This will turn to code smells, props is an important dependency.
    // We need to ensure that the flow of the state is handles from one direction/
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEdges, isIntialRender]);

  const addNewEdge = (event: any) => {
    event.preventDefault();
    setActiveEdges((edges: Array<EdgeChildProps>) => [...edges, {
      id: undefined,
      conditions: [],
      parentNode: { id: question.id, title: question.title },
      childNode: {},
    }]);
  };

  const deleteOption = (event: any, questionIndex: number, optionIndex: number) => {
    event.preventDefault();
    setActiveOptions((options) => {
      options.splice(optionIndex, 1);
      return [...options];
    });

    props.onQuestionOptionsChange(activeOptions, questionIndex);
  };

  const setOption = (event: any, questionIndex: number, optionIndex: number) => {
    event.preventDefault();
    const { value } = event.target;
    setActiveOptions((options) => {
      options[optionIndex] = { value, publicValue: '' };
      return [...options];
    });

    props.onQuestionOptionsChange(activeOptions, questionIndex);
  };

  return (
    <QuestionEntryContainer>
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
          <Select options={questionTypes} value={activeQuestionType} onChange={(qOption) => setQuestionType(qOption)} />
        </Div>
        {activeQuestionType.value === 'MULTI_CHOICE' && (
          <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
            <H4>OPTIONS</H4>
            {
              ((activeOptions && activeOptions.length === 0) || (!activeOptions)) && (
                <Div alignSelf="center">
                  No options available...
                </Div>
              )
            }
            {
              activeOptions && activeOptions.map((option, optionIndex) => (
                <Div key={`${optionIndex}-${option.value}`} my={1} useFlex flexDirection="row">
                  <StyledInput
                    key={optionIndex}
                    name={`${question.id}-option-${optionIndex}`}
                    defaultValue={option.value}
                    onBlur={(e) => setOption(e, index, optionIndex)}
                  />
                  <DeleteButtonContainer onClick={(e) => deleteOption(e, index, optionIndex)}>
                    <MinusCircle />
                  </DeleteButtonContainer>
                </Div>
              ))
            }
            <Hr />
            <Button brand="default" mt={2} ml={4} mr={4} onClick={(e) => addNewOption(e, index)}>Add new option</Button>
          </Div>
        )}
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <StyledLabel>Leaf node</StyledLabel>
          <Select options={leafs} value={(activeLeaf?.value && activeLeaf) || leafs[0]} onChange={(leafOption) => setLeafNode(leafOption)} />
        </Div>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <H4>Edges</H4>
          {
            ((activeEdges && activeEdges.length === 0) || (!activeEdges)) && (
              <Div alignSelf="center">
                No edges available...
              </Div>
            )
          }
          {
            activeEdges && activeEdges.map((edge: EdgeChildProps, edgeIndex: number) => (

              // TODO: setters rename to onXChange
              <EdgeEntry
                setEdgeConditionMatchValue={setEdgeConditionMatchValue}
                setEdgeConditionMaxValue={setEdgeConditionMaxValue}
                setEdgeConditionMinValue={setEdgeConditionMinValue}
                setChildQuestionNode={setChildQuestionNode}
                setConditionType={setConditionType}
                key={`${edgeIndex}-${edge.id}`}
                setActiveEdges={setActiveEdges}
                questions={questionsQ}
                edge={edge}
                index={edgeIndex}
              />
            ))
          }
          <Button brand="default" mt={2} ml={4} mr={4} onClick={(e) => addNewEdge(e)}>Add new edge</Button>
        </Div>
      </Div>
    </QuestionEntryContainer>
  );
};

export default QuestionEntryItem;
