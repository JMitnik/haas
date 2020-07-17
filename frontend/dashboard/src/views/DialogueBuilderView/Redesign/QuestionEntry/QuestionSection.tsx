import { Edit3, Plus, X } from 'react-feather';
import React, { useState } from 'react';

import { Flex, H2 } from '@haas/ui';
import DeleteCTAButton from 'views/ActionsOverview/components/DeleteCTAButton';
import EditCTAButton from 'views/ActionsOverview/components/EditCTAButton';
import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import SplitArrowIcon from 'components/Icons/SplitIcon';

import { AddQuestionContainer, DepthSpan } from './QuestionEntryStyles';
import { EdgeChildProps, EdgeConditonProps, QuestionEntryProps } from '../TopicBuilderInterfaces';
import QuestionEntry from './QuestionEntry';
import QuestionEntryForm from './QuestionEntryForm';

interface QuestionSectionProps {
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
}

const QuestionSection = ({ activeQuestion, onActiveQuestionChange, onAddQuestion, onDeleteQuestion, questionsQ, question, leafs, Icon, depth, condition }: QuestionSectionProps) => {
  const [isExpanded, setExpanded] = useState(depth === 1 || false);
  const handleExpandChange = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const activeChildrenIds = question.children?.map((child) => child.childNode.id);
  const children: Array<QuestionEntryProps> = questionsQ.filter((question) => activeChildrenIds?.includes(question.id));

  const getConditionOfQuestion = (childNodeId: string) => {
    const childNode = question.children?.find((child) => childNodeId === child.childNode.id);
    return childNode?.conditions[0];
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
        condition={condition}
        isExpanded={isExpanded}
        onExpandChange={handleExpandChange}
        activeQuestion={activeQuestion}
        onActiveQuestionChange={onActiveQuestionChange}
        onAddQuestion={onAddQuestion}
        onDeleteQuestion={onDeleteQuestion}
        key={0}
        index={0}
        questionsQ={questionsQ}
        question={question}
        Icon={Icon}
        leafs={leafs}
      />
      {isExpanded && children.map(
        (child, index) => (
          <QuestionSection
            condition={getConditionOfQuestion(child.id)}
            depth={depth + 1}
            Icon={child.icon} // child.Icon ?
            activeQuestion={activeQuestion}
            index={index}
            leafs={leafs}
            onActiveQuestionChange={onActiveQuestionChange}
            question={child}
            questionsQ={questionsQ}
            key={index}
            onAddQuestion={onAddQuestion}
            onDeleteQuestion={onDeleteQuestion}
          />
        ),
      )}
      {isExpanded && (
        <AddQuestionContainer margin={`0 ${depth * 10 + 10}px`}>
          <Plus width="35px" height="35px" />
          <H2>
            Add new question
          </H2>
        </AddQuestionContainer>
      )}

    </Flex>

  );
};

export default QuestionSection;
