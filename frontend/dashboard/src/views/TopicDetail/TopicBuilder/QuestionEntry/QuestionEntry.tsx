/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import { MinusCircle } from 'react-feather';
import { Muted, Div, H4, Button, StyledLabel, StyledInput, Hr, DeleteButtonContainer } from '@haas/ui';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import EdgeEntry from '../EdgeEntry/EdgeEntry';
import { QuestionEntryContainer } from './QuestionEntryStyles';
import { QuestionEntryProps, EdgeChildProps } from '../TopicBuilderInterfaces';

const questionTypes = [{ value: 'SLIDER', label: 'SLIDER' }, { value: 'MULTI_CHOICE', label: 'MULTI_CHOICE' }];

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

const QuestionEntryItem = ({ question, leafs, questionsQ, index, ...props }: QuestionEntryItemProps) => {
  const { register, errors } = useForm();
  // TODO: What is difference between eustion and questionsQ? <- Not clear

  // const [activeTitle, setActiveTitle] = useState(() => question.title);
  const activeTitle = question.title;
  const activeLeaf = { label: question.overrideLeaf?.title, value: question.overrideLeaf?.id };
  const activeQuestionType = { label: question.type, value: question.type };
  const activeOptions = question?.options || [];
  const activeEdges = question?.children || [];
  const isRoot = question?.isRoot;

  const setNewTitle = (event: any, qIndex: number) => {
    event.preventDefault();
    const newTitle = event.target.value;
    props.onTitleChange(newTitle, qIndex);
    // setActiveTitle(newTitle);
  };

  const setQuestionType = (questionType: any) => {
    const { value } = questionType;
    props.onQuestionTypeChange(value, index);
  };

  const setLeafNode = (leafNode: any) => {
    const { label, value } = leafNode;
    console.log('New Leafnode: ', leafNode);
    props?.onLeafNodeChange({ id: value, title: label }, index);
  };

  const setIsRootQuestion = () => {
    props?.onIsRootQuestionChange(!isRoot, index);
  };

  const addNewOption = (event: any, qIndex: number) => {
    event.preventDefault();

    const value = '';
    const publicValue = '';
    const newActiveOptions = [...activeOptions, { value, publicValue }];
    props.onAddQuestionOption(newActiveOptions, qIndex);
  };

  const setConditionType = (conditionType: string, edgeIndex: number) => {
    const edge: EdgeChildProps = activeEdges[edgeIndex];
    if (edge.conditions.length === 0) {
      edge.conditions = [{ conditionType }];
      props.onEdgesChange([...activeEdges], index);
    }

    edge.conditions[0].conditionType = conditionType;
    props.onEdgesChange([...activeEdges], index);
  };

  const setChildQuestionNode = (childNode: any, edgeIndex: number) => {
    const edge: EdgeChildProps = activeEdges[edgeIndex];
    if (!edge) {
      return props.onEdgesChange([...activeEdges], index);
    }

    edge.childNode = childNode;
    return props.onEdgesChange([...activeEdges], index);
  };

  const setEdgeConditionMinValue = (renderMin: number, edgeIndex: number) => {
    const edge: EdgeChildProps = activeEdges[edgeIndex];
    if (edge?.conditions?.length === 0) {
      edge.conditions = [{ renderMin }];
      props.onEdgesChange([...activeEdges], index);
    }

    edge.conditions[0].renderMin = renderMin;
    props.onEdgesChange([...activeEdges], index);
  };

  const setEdgeConditionMaxValue = (renderMax: number, edgeIndex: number) => {
    const edge: EdgeChildProps = activeEdges[edgeIndex];
    if (edge?.conditions?.length === 0) {
      edge.conditions = [{ renderMax }];
      props.onEdgesChange([...activeEdges], index);
    }

    edge.conditions[0].renderMax = renderMax;
    props.onEdgesChange([...activeEdges], index);
  };

  const setEdgeConditionMatchValue = (matchValue: string, edgeIndex: number) => {
    const edge: EdgeChildProps = activeEdges[edgeIndex];
    if (edge?.conditions?.length === 0) {
      edge.conditions = [{ matchValue }];
      props.onEdgesChange([...activeEdges], index);
    }

    edge.conditions[0].matchValue = matchValue;
    props.onEdgesChange([...activeEdges], index);
  };

  // useEffect(() => {
  //   if (isIntialRender.current === true) {
  //     isIntialRender.current = false;
  //   }

  //   // onEdgesChange(activeEdges, index);
  //   // TODO: This will turn to code smells, props is an important dependency.
  //   // We need to ensure that the flow of the state is handles from one direction/
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeEdges, isIntialRender]);

  const addNewEdge = (event: any) => {
    event.preventDefault();
    props.onEdgesChange([
      ...activeEdges, {
        id: undefined,
        conditions: [],
        parentNode: { id: question.id, title: question.title },
        childNode: {},
      }], index);
  };

  const deleteEdgeEntry = (event: any, edgeIndex: number) => {
    event.preventDefault();

    activeEdges.splice(edgeIndex, 1);
    props.onEdgesChange([...activeEdges], index);
  };

  const deleteOption = (event: any, questionIndex: number, optionIndex: number) => {
    event.preventDefault();
    activeOptions.splice(optionIndex, 1);
    props.onQuestionOptionsChange(activeOptions, questionIndex);
  };

  const setOption = (event: any, questionIndex: number, optionIndex: number) => {
    event.preventDefault();
    const { value } = event.target;
    activeOptions[optionIndex] = { value, publicValue: '' };
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
                  <DeleteQuestionOptionButtonContainer onClick={(e) => deleteOption(e, index, optionIndex)}>
                    <MinusCircle />
                  </DeleteQuestionOptionButtonContainer>
                </Div>
              ))
            }
            <Button brand="default" mt={2} ml={4} mr={4} onClick={(e) => addNewOption(e, index)}>Add new option</Button>
            <Hr />
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
                deleteEdgeEntry={deleteEdgeEntry}
                key={`${edgeIndex}-${edge.id}`}
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
