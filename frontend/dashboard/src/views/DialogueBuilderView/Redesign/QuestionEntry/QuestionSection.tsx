import React, { useState } from 'react';

import { Flex, Span } from '@haas/ui';

import { AddChildContainer, AddChildIconContainer, LinkContainer, OverflowSpan, QuestionEntryContainer, QuestionEntryViewContainer, TypeSpan } from './QuestionEntryStyles';
import { EdgeChildProps, QuestionEntryProps } from '../TopicBuilderInterfaces';
import QuestionEntry from './QuestionEntry';

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
}

const QuestionSection = ({ activeQuestion, onActiveQuestionChange, onAddQuestion, onDeleteQuestion, questionsQ, question, leafs, Icon, depth }: QuestionSectionProps) => {
  const [isExpanded, setExpanded] = useState(false);
  const handleExpandChange = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const activeChildrenIds = question.children?.map((child) => child.childNode.id);
  console.log('activeChildrenIds', activeChildrenIds);
  console.log('QUESTIONS Q: ', questionsQ);
  const children: Array<QuestionEntryProps> = questionsQ.filter((question) => activeChildrenIds?.includes(question.id));
  console.log('children: ', children);

  return (
    <Flex padding={`${depth * 10}px`} flexDirection="column">
      <Span>
        DEPTH
        {' '}
        {depth}
      </Span>
      <QuestionEntry
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
    </Flex>

  );
};

export default QuestionSection;
