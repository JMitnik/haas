import React, { useState } from 'react';
import { MinusCircle, PlusCircle } from 'react-feather';
import { Muted, Div, H4, Button, StyledLabel, StyledInput, Hr } from '@haas/ui';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import EdgeEntry from '../EdgeEntry/EdgeEntry';
import { QuestionEntryContainer, DeleteQuestionOptionButtonContainer, QuestionEntryHeader } from './QuestionEntryStyles';
import { QuestionEntryProps, EdgeChildProps } from '../TopicBuilderInterfaces';

const questionTypes = [
  { value: 'SLIDER', label: 'SLIDER' },
  { value: 'MULTI_CHOICE', label: 'MULTI_CHOICE' }];

interface QuestionEntryItemProps {
  questionsQ: Array<QuestionEntryProps>;
  question: QuestionEntryProps;
  // TODO: Use right type for leafs;
  leafs: any;
  index: number;
  activeExpanded: Array<any>;
  onAddQuestion: (event: any, questionUUID: string) => void;
  onDeleteQuestion: (event: any, questionId: string) => void;
  setActiveExpanded: (newExpanded: any) => void;
  // TODO: Define function type, ala () => void or whatever
  onTitleChange: (newTitle: string, questionId: string) => void;
  onLeafNodeChange: (leaf: any, questionId: string) => void;
  onQuestionTypeChange: (value: string, questionId: string) => void;
  onQuestionOptionsChange: (value: Array<any>, questionId: string) => void;
  onAddQuestionOption: (value: Array<any>, questionId: string) => void;
  onEdgesChange: (edges: Array<EdgeChildProps>, questionId: string) => void;
  onIsRootQuestionChange: (isRoot: boolean, questionId: string) => void;
  onQuestionExpandChange: (question: any) => void;
}

const QuestionEntryItem = ({ question,
  leafs,
  questionsQ,
  index,
  activeExpanded,
  onAddQuestion,
  setActiveExpanded,
  onDeleteQuestion,
  ...props }: QuestionEntryItemProps) => {
  const { register, errors } = useForm();
  // TODO: What is difference between eustion and questionsQ? <- Not clear

  const [optionsExpanded, setOptionsExpanded] = useState(false);

  const activeTitle = question.title;
  const activeLeaf = { label: question.overrideLeaf?.title, value: question.overrideLeaf?.id };
  const activeQuestionType = { label: question.type, value: question.type };
  const activeOptions = question?.options || [];
  const activeEdges = question?.children || [];
  const isRoot = question?.isRoot;

  const setNewTitle = (event: any, qIndex: number) => {
    event.preventDefault();
    const newTitle = event.target.value;
    //TODO: check if questionId works instead of index
    props.onTitleChange(newTitle, question.id);
  };

  const setQuestionType = (questionType: any) => {
    const { value } = questionType;
    if (value === 'MULTI_CHOICE') {
      setOptionsExpanded(true);
    }
    props.onQuestionTypeChange(value, question.id);
  };

  const setLeafNode = (leafNode: any) => {
    const { label, value } = leafNode;
    props?.onLeafNodeChange({ id: value, title: label }, question.id);
  };

  const setIsRootQuestion = () => {
    props?.onIsRootQuestionChange(!isRoot, question.id);
  };

  const addNewOption = (event: any, qIndex: number) => {
    event.preventDefault();

    const value = '';
    const publicValue = '';
    const newActiveOptions = [...activeOptions, { value, publicValue }];
    props.onAddQuestionOption(newActiveOptions, question.id);
  };

  const setConditionType = (conditionType: string, edgeIndex: number) => {
    const edge: EdgeChildProps = activeEdges[edgeIndex];
    if (edge.conditions.length === 0) {
      edge.conditions = [{ conditionType }];
      props.onEdgesChange([...activeEdges], question.id);
    }

    edge.conditions[0].conditionType = conditionType;
    props.onEdgesChange([...activeEdges], question.id);
  };

  const setChildQuestionNode = (childNode: any, edgeIndex: number) => {
    const edge: EdgeChildProps = activeEdges[edgeIndex];
    if (!edge) {
      return props.onEdgesChange([...activeEdges], question.id);
    }

    edge.childNode = childNode;
    return props.onEdgesChange([...activeEdges], question.id);
  };

  const setEdgeConditionMinValue = (renderMin: number, edgeIndex: number) => {
    const edge: EdgeChildProps = activeEdges[edgeIndex];
    if (edge?.conditions?.length === 0) {
      edge.conditions = [{ renderMin }];
      props.onEdgesChange([...activeEdges], question.id);
    }

    edge.conditions[0].renderMin = renderMin;
    props.onEdgesChange([...activeEdges], question.id);
  };

  const setEdgeConditionMaxValue = (renderMax: number, edgeIndex: number) => {
    const edge: EdgeChildProps = activeEdges[edgeIndex];
    if (edge?.conditions?.length === 0) {
      edge.conditions = [{ renderMax }];
      props.onEdgesChange([...activeEdges], question.id);
    }

    edge.conditions[0].renderMax = renderMax;
    props.onEdgesChange([...activeEdges], question.id);
  };

  const setEdgeConditionMatchValue = (matchValue: string, edgeIndex: number) => {
    const edge: EdgeChildProps = activeEdges[edgeIndex];
    if (edge?.conditions?.length === 0) {
      edge.conditions = [{ matchValue }];
      props.onEdgesChange([...activeEdges], question.id);
    }

    edge.conditions[0].matchValue = matchValue;
    props.onEdgesChange([...activeEdges], question.id);
  };

  const addNewEdge = (event: any) => {
    event.preventDefault();
    const questionUUID = uuidv4();
    onAddQuestion(event, questionUUID)
    props.onEdgesChange([
      ...activeEdges, {
        id: undefined,
        conditions: [],
        parentNode: { id: question.id, title: question.title },
        childNode: { id: questionUUID},
      }], question.id);
    
  };

  const deleteEdgeEntry = (event: any, edgeIndex: number) => {
    event.preventDefault();

    const removedEdge = activeEdges.splice(edgeIndex, 1);
    console.log('removed edge: ', removedEdge?.[0].childNode?.id)
    if (removedEdge?.[0].childNode?.id) {
      onDeleteQuestion(event, removedEdge?.[0].childNode?.id)
    } 
    props.onEdgesChange([...activeEdges], question.id);
  };

  const deleteOption = (event: any, questionIndex: number, optionIndex: number) => {
    event.preventDefault();
    activeOptions.splice(optionIndex, 1);
    props.onQuestionOptionsChange(activeOptions, question.id);
  };

  const setOption = (event: any, questionIndex: number, optionIndex: number) => {
    event.preventDefault();
    const { value } = event.target;
    activeOptions[optionIndex] = { value, publicValue: '' };
    props.onQuestionOptionsChange(activeOptions, question.id);
  };

  return (
    <QuestionEntryContainer>

      <Div margin={5} py={6}>
        <QuestionEntryHeader pl={4} pr={4} pb={2} pt={2} onClick={() => props.onQuestionExpandChange(question?.id)}>
          Question:
            {question.title} ({question.id})
        </QuestionEntryHeader>
        {activeExpanded.includes(question.id) &&
          <Div backgroundColor="#daecfc">

            <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
              <StyledLabel>Title</StyledLabel>
              <StyledInput
                name="title"
                defaultValue={activeTitle}
                onBlur={(e) => setNewTitle(e, index)}
                ref={register({ required: true })}
              />
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
              <Select
                options={questionTypes}
                value={activeQuestionType}
                onChange={(qOption) => setQuestionType(qOption)}
              />
            </Div>

            {activeQuestionType.value === 'MULTI_CHOICE' && (
              <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
                <QuestionEntryHeader onClick={() => setOptionsExpanded(!optionsExpanded)}>OPTIONS ({activeOptions.length} option(s) selected)</QuestionEntryHeader>
                {optionsExpanded &&
                  <Div>
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
                          <DeleteQuestionOptionButtonContainer
                            onClick={(e) => deleteOption(e, index, optionIndex)}
                          >
                            <MinusCircle />
                          </DeleteQuestionOptionButtonContainer>
                        </Div>
                      ))
                    }
                    <Button
                      brand="default"
                      mt={2}
                      ml={4}
                      mr={4}
                      onClick={(e) => addNewOption(e, index)}
                    >
                      Add new option
                </Button>
                    <Hr />
                  </Div>}

              </Div>
            )}

            <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
              <StyledLabel>Leaf node</StyledLabel>
              <Select
                options={leafs}
                value={(activeLeaf?.value && activeLeaf) || leafs[0]}
                onChange={(leafOption) => setLeafNode(leafOption)}
              />
            </Div>

            <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
                  <Div useFlex justifyContent='space-between' mb={1}>
                    <H4>Edges ({activeEdges.length} selected)</H4>
                    <PlusCircle style={{cursor: 'pointer'}} onClick={(e) => addNewEdge(e)} />
                  </Div>
                  <Hr/>
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
                    leafs={leafs}
                    onAddQuestion={onAddQuestion}
                    onDeleteQuestion={onDeleteQuestion}
                    onQuestionExpandChange={props.onQuestionExpandChange}
                    activeExpanded={activeExpanded}
                    setActiveExpanded={setActiveExpanded}
                    onTitleChange={props.onTitleChange}
                    onLeafNodeChange={props.onLeafNodeChange}
                    onQuestionTypeChange={props.onQuestionTypeChange}
                    onQuestionOptionsChange={props.onQuestionOptionsChange}
                    onAddQuestionOption={props.onAddQuestionOption}
                    onEdgesChange={props.onEdgesChange}
                    onIsRootQuestionChange={props.onIsRootQuestionChange}
                    setEdgeConditionMatchValue={setEdgeConditionMatchValue}
                    setEdgeConditionMaxValue={setEdgeConditionMaxValue}
                    setEdgeConditionMinValue={setEdgeConditionMinValue}
                    setChildQuestionNode={setChildQuestionNode}
                    setConditionType={setConditionType}
                    deleteEdgeEntry={deleteEdgeEntry}
                    key={`${edgeIndex}-${edge.id}`}
                    questions={questionsQ}
                    question={question}
                    edge={edge}
                    index={edgeIndex}
                  />
                ))
              }
            </Div>
          </Div>
        }
      </Div >

    </QuestionEntryContainer >
  );
};

export default QuestionEntryItem;
