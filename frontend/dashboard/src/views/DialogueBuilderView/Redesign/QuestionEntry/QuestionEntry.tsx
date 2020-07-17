import { Div, Flex, Span } from '@haas/ui';
import { Edit3, Minus, Plus, X } from 'react-feather';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';

import EditCTAButton from 'views/ActionsOverview/components/EditCTAButton';
import LinkIcon from 'components/Icons/LinkIcon';

import OpinionIcon from 'components/Icons/OpinionIcon';
import { AddChildContainer, AddChildIconContainer, LinkContainer, OverflowSpan, QuestionEntryContainer, QuestionEntryViewContainer, TypeSpan } from './QuestionEntryStyles';
import { EdgeChildProps, QuestionEntryProps } from '../TopicBuilderInterfaces';
import BuilderIcon from '../components/BuilderIcon';
import DeleteCTAButton from '../components/DeleteCTAButton';
import QuestionEntryForm from './QuestionEntryForm';
import RegisterIcon from 'components/Icons/RegisterIcon';

interface QuestionEntryItemProps {
  onExpandChange: () => void;
  isExpanded: Boolean;
  questionsQ: Array<QuestionEntryProps>;
  question: QuestionEntryProps;
  leafs: any;
  index: number;
  Icon: (props: any) => JSX.Element;
  activeQuestion: string | null;
  onAddQuestion?: (event: any, questionUUID: string) => void;
  onDeleteQuestion?: (event: any, questionId: string) => void;
  onActiveQuestionChange: React.Dispatch<React.SetStateAction<string | null>>;
}

const AddChildComponent = ({ isExpanded, onExpandChange }:{ isExpanded: Boolean, onExpandChange: () => void }) => (
  <AddChildContainer onClick={() => onExpandChange()}>
    <AddChildIconContainer>
      {isExpanded ? <Minus /> : <Plus />}
    </AddChildIconContainer>
    <Span padding="4px">
      {isExpanded ? 'Hide children' : 'Show children'}
    </Span>
  </AddChildContainer>
);

const QuestionEntryItem = (
  { question, activeQuestion, onActiveQuestionChange, Icon, leafs, onExpandChange, isExpanded }: QuestionEntryItemProps,
) => {
  const activeType = { label: question.type, value: question.type };
  const activeLeaf = { label: question.overrideLeaf?.title, value: question.overrideLeaf?.id };

  return (
    <Flex position="relative" justifyContent="center" alignItems="center" flexGrow={1}>
      <QuestionEntryViewContainer activeCTA={null} id={question.id} flexGrow={1}>
        <QuestionEntryContainer flexGrow={1}>
          <DeleteCTAButton disabled={(!!activeQuestion && activeQuestion !== question.id) || false} onClick={() => null}>
            <X />
          </DeleteCTAButton>

          <Flex flexDirection="row" width="100%">
            <BuilderIcon type={question.type} Icon={Icon} />

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
              onActiveQuestionChange={onActiveQuestionChange}
            />
          )}

        </QuestionEntryContainer>
      </QuestionEntryViewContainer>
      <LinkContainer hasCTA={!!question.overrideLeaf?.id}>
        <Flex flexDirection="column" padding="25px" color="black" justifyContent="center" alignItems="center">
          { (!question.overrideLeaf?.type || question.overrideLeaf?.type === 'Link') && (
            <LinkIcon isCTA hasCTA />
          )}

          { question.overrideLeaf?.type === 'Opinion' && (
            <OpinionIcon isCTA hasCTA />
          )}

          { question.overrideLeaf?.type === 'Register' && (
          <RegisterIcon isCTA hasCTA />
          )}

          <TypeSpan fontSize="0.6em">
            {question.overrideLeaf?.type || 'None'}
          </TypeSpan>
        </Flex>
      </LinkContainer>
      <AddChildComponent isExpanded={isExpanded} onExpandChange={onExpandChange} />
    </Flex>
  );
};

export default QuestionEntryItem;
