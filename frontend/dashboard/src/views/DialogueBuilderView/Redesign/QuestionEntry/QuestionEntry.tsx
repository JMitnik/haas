import { Div, Flex, Span } from '@haas/ui';
import { Edit3, X } from 'react-feather';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';

import EditCTAButton from 'views/ActionsOverview/components/EditCTAButton';

import { EdgeChildProps, QuestionEntryProps } from '../TopicBuilderInterfaces';
import { OverflowSpan, QuestionEntryContainer } from './QuestionEntryStyles';
import DeleteCTAButton from '../components/DeleteCTAButton';
import QuestionEntryForm from './QuestionEntryForm';

interface QuestionEntryItemProps {
  questionsQ: Array<QuestionEntryProps>;
  question: QuestionEntryProps;
  // TODO: Use right type for leafs;
  leafs: any;
  index: number;
  activeQuestion: string | null;
  onAddQuestion: (event: any, questionUUID: string) => void;
  onDeleteQuestion: (event: any, questionId: string) => void;
  onActiveQuestionChange: React.Dispatch<React.SetStateAction<string | null>>;
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

const QuestionEntryItem = (
  { question, activeQuestion, onActiveQuestionChange, leafs }: QuestionEntryItemProps,
) => {
  const activeType = { label: question.type, value: question.type };
  const activeLeaf = { label: question.overrideLeaf?.title, value: question.overrideLeaf?.id };

  return (
    <QuestionEntryContainer activeCTA={null} id={question.id}>
      <DeleteCTAButton disabled={(!!activeQuestion && activeQuestion !== question.id) || false} onClick={() => null}>
        <X />
      </DeleteCTAButton>

      <Flex flexDirection="row" width="100%">
        {/* <CTAIcon type={question.type} Icon={Icon} /> */}

        <Flex width="60%" flexDirection="column">
          <Span fontSize="1.4em">
            Title
          </Span>
          <OverflowSpan>
            {question.title || 'None'}
          </OverflowSpan>
        </Flex>

        <Flex width="30%" alignItems="center" justifyContent="center">
          <EditCTAButton
            disabled={(activeQuestion && activeQuestion !== question.id) || false}
            onClick={() => onActiveQuestionChange(question.id)}
          >
            <Edit3 />
            <Span>
              Edit
            </Span>
          </EditCTAButton>
        </Flex>

      </Flex>
      <Div margin={5} py={6}>
        {activeQuestion === question.id
          && (
            <QuestionEntryForm
              id={question.id}
              title={question.title}
              isRoot={question.isRoot}
              leafs={leafs}
              options={question?.options || []}
              overrideLeaf={activeLeaf}
              type={activeType}
            />
          )}
      </Div>

    </QuestionEntryContainer>
  );
};

export default QuestionEntryItem;
