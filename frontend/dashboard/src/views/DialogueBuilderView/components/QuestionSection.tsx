import { Div, Flex, H4 } from '@haas/ui';
import { Plus } from 'react-feather';
import { isPresent } from 'ts-is-present';
import { orderBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import SplitArrowIcon from 'components/Icons/SplitIcon';

import { AddQuestionContainer, DepthSpan } from './QuestionEntry/QuestionEntryStyles';
import {
  CTANode,
  EdgeConditionProps,
  MappedQuestionOptionProps,
  QuestionEntryProps,
} from '../DialogueBuilderInterfaces';
import { QuestionNodeProblem } from '../DialogueBuilderTypes';
import { findProblemsInChildCondition } from '../findProblemsInChildConditions';
import QuestionEntry from './QuestionEntry/QuestionEntry';

interface QuestionSectionProps {
  parentQuestionType: string;
  options: MappedQuestionOptionProps[] | undefined;
  questionsQ: Array<QuestionEntryProps>;
  question: QuestionEntryProps;
  leafs: any;
  ctaNodes: CTANode[];
  index: number;
  Icon: (props: any) => JSX.Element;
  activeQuestion: string | null;
  onAddQuestion?: (event: any, questionUUID: string) => void;
  onDeleteQuestion?: (event: any, questionId: string) => void;
  onActiveQuestionChange: React.Dispatch<React.SetStateAction<string | null>>;
  depth: number;
  condition: EdgeConditionProps | undefined;
  edgeId: string | undefined;
  problems?: (QuestionNodeProblem | undefined)[];
}

const orderByOptions = (question: QuestionEntryProps) => {
  const { options } = question;
  const { children } = question;
  const orderedOptions = orderBy(options, (option) => option.position, 'asc');
  const mappedOptionChildren = orderedOptions.map((option) => {
    const optionChild = children?.find((child) => child.conditions[0].matchValue === option.value);
    return optionChild;
  }).filter(isPresent);
  return mappedOptionChildren;
};

const QuestionSection = ({
  index,
  activeQuestion,
  problems,
  onActiveQuestionChange,
  onAddQuestion,
  onDeleteQuestion,
  questionsQ,
  question,
  leafs,
  ctaNodes,
  Icon,
  depth,
  condition,
  options,
  edgeId,
  parentQuestionType,
}: QuestionSectionProps) => {
  const { t } = useTranslation();
  const [isQuestionExpanded, setQuestionExpanded] = useState(depth === 1 || false);
  const [isAddExpanded, setAddExpanded] = useState(false);
  const handleExpandChange = () => {
    setQuestionExpanded((prevExpanded) => !prevExpanded);
  };

  const orderedChildren = question.type === 'Slider'
    ? orderBy(question.children, (child) => child.conditions[0].renderMin, 'asc')
    : orderByOptions(question);

  const activeChildrenIds = orderedChildren?.map((child) => child.childNode.id);

  const children = activeChildrenIds?.map(
    (childId) => questionsQ.find((childQuestion) => childQuestion.id === childId) as QuestionEntryProps,
  ) as QuestionEntryProps[];

  const parentOptions = question?.options?.map((option) => ({
    id: option.id,
    position: option.position,
    value: option.value,
    publicValue: option.publicValue,
    overrideLeaf: {
      label: option.overrideLeaf?.title,
      value: option.overrideLeaf?.id,
      type: option.overrideLeaf?.type,
    },
    isTopic: option.isTopic,
  })) || [];

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

  const childConditions = children.map((child) => getConditionOfParentQuestion(child.id));
  const childConditionsProblems: any[] = question.isRoot ? findProblemsInChildCondition(childConditions) : [];

  return (
    <Flex data-cy="QuestionSection" paddingTop="10px" paddingBottom="10px" flexDirection="column" paddingLeft={`${depth * 10}px`}>
      {depth > 1 && index === 0 && (
        <Flex marginBottom="15px" alignItems="center">
          <SplitArrowIcon />
          <DepthSpan fontSize="0.9em">
            {t('depth')}
            {' '}
            {depth}
          </DepthSpan>
        </Flex>
      )}

      {/* The question itself */}
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
        key={`entry-${question.id}`}
        index={0}
        questionsQ={questionsQ}
        question={question}
        Icon={Icon}
        problems={problems || []}
        ctaNodes={ctaNodes}
      />

      {/* Children */}
      {isQuestionExpanded && children.map((child, childIndex) => (
        <QuestionSection
          edgeId={getEdgeIdfromParentQuestion(child.id)}
          options={parentOptions}
          parentQuestionType={question.type}
          condition={getConditionOfParentQuestion(child.id)}
          depth={depth + 1}
          Icon={child.icon}
          activeQuestion={activeQuestion}
          index={childIndex}
          leafs={leafs}
          ctaNodes={ctaNodes}
          onActiveQuestionChange={onActiveQuestionChange}
          question={child}
          questionsQ={questionsQ}
          key={`section-${child.id}`}
          problems={childConditionsProblems[childIndex]}
          onAddQuestion={onAddQuestion}
          onDeleteQuestion={onDeleteQuestion}
        />
      ))}

      {/* Card for adding question */}
      {(isQuestionExpanded && !isAddExpanded) && (
        <AddQuestionContainer onClick={() => handleAdd()}>
          <Flex justifyContent="center" alignItems="center">
            <Plus width="25px" height="25px" />
            <H4>
              {t('add_question')}
            </H4>
          </Flex>
        </AddQuestionContainer>
      )}

      {/* Adding new question */}
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
            problems={[]}
            questionsQ={questionsQ}
            question={{
              id: '-1', title: '', icon: Icon, isRoot: false, isLeaf: false, type: 'Choice', extraContent: '',
            }}
            Icon={Icon}
            ctaNodes={ctaNodes}
          />
        </Div>
      )}

    </Flex>
  );
};

export default QuestionSection;
