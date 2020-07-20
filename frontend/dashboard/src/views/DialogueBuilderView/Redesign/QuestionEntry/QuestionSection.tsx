import { Edit3, Plus, X } from 'react-feather';
import React, { useState } from 'react';

import { Div, Flex, H2 } from '@haas/ui';
import DeleteCTAButton from 'views/ActionsOverview/components/DeleteCTAButton';
import EditCTAButton from 'views/ActionsOverview/components/EditCTAButton';
import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import SplitArrowIcon from 'components/Icons/SplitIcon';

import { AddQuestionContainer, DepthSpan } from './QuestionEntryStyles';
import { EdgeChildProps, EdgeConditonProps, QuestionEntryProps, QuestionOptionProps } from '../TopicBuilderInterfaces';
import QuestionEntry from './QuestionEntry';
import QuestionEntryForm from './QuestionEntryForm';

interface QuestionSectionProps {
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

const QuestionSection = ({ activeQuestion, onActiveQuestionChange, onAddQuestion, onDeleteQuestion, questionsQ, question, leafs, Icon, depth, condition, options, edgeId }: QuestionSectionProps) => {
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

  return (
    <Flex padding={`${depth * 10}px`} flexDirection="column">
      { depth > 1 && (
      <Flex marginBottom="5px" alignItems="center">
        <SplitArrowIcon />
        <DepthSpan fontSize="0.9em">
          DEPTH
          {' '}
          {depth}
        </DepthSpan>
      </Flex>
      )}
      <QuestionEntry
        edgeId={edgeId}
        parentOptions={options}
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
        <AddQuestionContainer margin={`0 ${depth * 10 + 10}px`}>
          <Flex onClick={() => handleAdd()} justifyContent="center" alignItems="center">
            <Plus width="35px" height="35px" />
            <H2>
              Add new question
            </H2>
          </Flex>
        </AddQuestionContainer>
      )}
      {(isQuestionExpanded && isAddExpanded) && (
        <Div margin={`0 ${depth * 10 + 10}px`}>
          <QuestionEntry
            onAddExpandChange={setAddExpanded}
            parentQuestionId={question.id}
            edgeId=""
            parentOptions={[]}
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
