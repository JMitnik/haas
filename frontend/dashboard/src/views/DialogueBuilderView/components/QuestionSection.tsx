import { Plus } from 'react-feather';
import React, { useState } from 'react';

import { Div, Flex, H4 } from '@haas/ui';
import SplitArrowIcon from 'components/Icons/SplitIcon';

import { AddQuestionContainer, DepthSpan } from './QuestionEntry/QuestionEntryStyles';
import { EdgeConditonProps, QuestionEntryProps, QuestionOptionProps } from '../DialogueBuilderInterfaces';
import QuestionEntry from './QuestionEntry/QuestionEntry';

interface QuestionSectionProps {
  parentQuestionType: string;
  options: QuestionOptionProps[] | undefined;
  questionsQ: Array<QuestionEntryProps>;
  question: QuestionEntryProps;
  leafs: any;
  index: number;
  Icon: (props: any) => JSX.Element;
  activeQuestion: string | null;
  onAddQuestion?: (event: any, questionUUID: string) => void;
  onDeleteQuestion?: (event: any, questionId: string) => void;
  onActiveQuestionChange: React.Dispatch<React.SetStateAction<string | null>>;
  depth: number;
  condition: EdgeConditonProps | undefined;
  edgeId: string | undefined;
}

const QuestionSection = ({
  index,
  activeQuestion,
  onActiveQuestionChange,
  onAddQuestion,
  onDeleteQuestion,
  questionsQ,
  question,
  leafs,
  Icon,
  depth,
  condition,
  options,
  edgeId,
  parentQuestionType,
}: QuestionSectionProps) => {
  const [isQuestionExpanded, setQuestionExpanded] = useState(depth === 1 || false);
  const [isAddExpanded, setAddExpanded] = useState(false);
  const handleExpandChange = () => {
    setQuestionExpanded((prevExpanded) => !prevExpanded);
  };

  const activeChildrenIds = question.children?.map((child) => child.childNode.id);
  const children: Array<QuestionEntryProps> = questionsQ.filter((question) => activeChildrenIds?.includes(question.id));
  const parentOptions = question.options;

  const getConditionOfParentQuestion = (childNodeId: string) => {
    const edge = question.children?.find((child) => childNodeId === child.childNode.id);
    return edge?.conditions[0];
  };

  const getEdgeIdfromParentQuestion = (childNodeId: string) => {
    const edge = question.children?.find((child) => childNodeId === child.childNode.id);
    return edge?.id;
  };

  const handleAdd = () => {
    setAddExpanded(true);
    onActiveQuestionChange('-1');
  };

  // If you want indent
  // 1. add paddingLeft={`${depth * 10}px`} to parent flex
  // 2. add marginLeft={`${depth * 10 + 10}px`} to AddQuestionContainer
  // 3. add marginLeft={`${depth * 10 + 10}px`} to Div around where (isQuestionExpanded && isAddExpanded)
  return (
    <Flex paddingTop="10px" paddingBottom="10px" flexDirection="column" paddingLeft={`${depth * 10}px`}>
      {depth > 1 && index === 0 && (
      <Flex marginBottom="15px" alignItems="center">
        <SplitArrowIcon />
        <DepthSpan fontSize="0.9em">
          DEPTH
          {' '}
          {depth}
        </DepthSpan>
      </Flex>
      )}

      <QuestionEntry
        depth={depth}
        edgeId={edgeId}
        parentOptions={options}
        parentQuestionType={parentQuestionType}
        condition={condition}
        isExpanded={isQuestionExpanded}
        onExpandChange={handleExpandChange}
        activeQuestion={activeQuestion}
        onActiveQuestionChange={onActiveQuestionChange}
        onAddQuestion={onAddQuestion}
        onDeleteQuestion={onDeleteQuestion}
        key={`entry-${question.id}-${question.updatedAt}`}
        index={0}
        questionsQ={questionsQ}
        question={question}
        Icon={Icon}
        leafs={leafs}
      />

      {isQuestionExpanded && children.map(
        (child, index) => (
          <QuestionSection
            edgeId={getEdgeIdfromParentQuestion(child.id)}
            options={parentOptions}
            parentQuestionType={question.type}
            condition={getConditionOfParentQuestion(child.id)}
            depth={depth + 1}
            Icon={child.icon}
            activeQuestion={activeQuestion}
            index={index}
            leafs={leafs}
            onActiveQuestionChange={onActiveQuestionChange}
            question={child}
            questionsQ={questionsQ}
            key={`section-${child.id}-${child.updatedAt}`}
            onAddQuestion={onAddQuestion}
            onDeleteQuestion={onDeleteQuestion}
          />
        ),
      )}

      {(isQuestionExpanded && !isAddExpanded) && (
        <AddQuestionContainer onClick={() => handleAdd()}>
          <Flex justifyContent="center" alignItems="center">
            <Plus width="25px" height="25px" />
            <H4>
              Add new question
            </H4>
          </Flex>
        </AddQuestionContainer>
      )}

      {(isQuestionExpanded && isAddExpanded) && (
        <Div marginLeft={`${depth * 10 + 10}px`}>
          <QuestionEntry
            depth={depth}
            onAddExpandChange={setAddExpanded}
            parentQuestionType={question.type}
            parentQuestionId={question.id}
            edgeId=""
            parentOptions={parentOptions}
            condition={undefined}
            isExpanded={isQuestionExpanded}
            onExpandChange={handleExpandChange}
            activeQuestion="-1"
            onActiveQuestionChange={onActiveQuestionChange}
            onAddQuestion={onAddQuestion}
            onDeleteQuestion={onDeleteQuestion}
            key={`entry-depth-${depth}-add-new`}
            index={0}
            questionsQ={questionsQ}
            question={{
              id: '-1', title: '', icon: Icon, isRoot: false, isLeaf: false, type: 'Multi-Choice',
            }}
            Icon={Icon}
            leafs={leafs}
          />
        </Div>
      )}

    </Flex>
  );
};

export default QuestionSection;
