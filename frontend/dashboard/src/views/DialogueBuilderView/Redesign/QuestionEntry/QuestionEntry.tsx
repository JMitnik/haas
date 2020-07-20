import { Div, Flex, Span } from '@haas/ui';
import { Edit3, Minus, Plus, X } from 'react-feather';
import React from 'react';

import EditCTAButton from 'views/ActionsOverview/components/EditCTAButton';
import HaasNodeIcon from 'components/Icons/HaasNodeIcon';
import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';

import {
  AddChildContainer,
  AddChildIconContainer,
  ConditionContainer,
  ConditionSpan,
  LinkContainer,
  OverflowSpan,
  QuestionEntryContainer,
  QuestionEntryViewContainer,
  TypeSpan,
} from './QuestionEntryStyles';
import { EdgeConditonProps, QuestionEntryProps, QuestionOptionProps } from '../TopicBuilderInterfaces';
import BuilderIcon from '../components/BuilderIcon';
import DeleteCTAButton from '../components/DeleteCTAButton';

import QuestionEntryForm from './QuestionEntryForm';

interface QuestionEntryItemProps {
  onAddExpandChange?: React.Dispatch<React.SetStateAction<boolean>>;
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
  condition: EdgeConditonProps | undefined;
  parentOptions: QuestionOptionProps[] | undefined;
  edgeId: string | undefined;
  parentQuestionId?: string;
  depth: number;
}

interface AddChildComponentProps {
  amtChildren?: number;
  isExpanded: Boolean;
  onExpandChange: () => void;
}

const AddChildComponent = ({ amtChildren, isExpanded, onExpandChange }: AddChildComponentProps) => (
  <AddChildContainer onClick={() => onExpandChange()}>
    <AddChildIconContainer>
      {isExpanded ? <Minus /> : <Plus />}
    </AddChildIconContainer>
    <Span padding="4px">
      {isExpanded ? `Hide children (${amtChildren})` : `Show children (${amtChildren})`}
    </Span>
  </AddChildContainer>
);

const ConditionView = ({ condition } : { condition: EdgeConditonProps | undefined}) => (
  <ConditionContainer>
    <HaasNodeIcon width="25" height="25" isDark />
    {condition?.conditionType === 'match' && (
      <ConditionSpan fontSize="0.6em">
        <abbr title={condition.matchValue}>{condition.matchValue}</abbr>
      </ConditionSpan>
    )}

    {condition?.conditionType === 'valueBoundary' && (
      <ConditionSpan fontSize="0.6em">
        {`${condition.renderMin} - ${condition.renderMax}`}
      </ConditionSpan>
    )}

  </ConditionContainer>
);

const QuestionEntryItem = (
  { depth,
    question,
    activeQuestion,
    onActiveQuestionChange,
    Icon,
    leafs,
    onExpandChange,
    isExpanded,
    condition,
    parentOptions,
    edgeId,
    parentQuestionId,
    onAddExpandChange }
  : QuestionEntryItemProps,
) => {
  const activeType = question.type === 'Multi-Choice'
    ? { label: question.type, value: 'MULTI_CHOICE' }
    : { label: question.type, value: 'SLIDER' };

  return (
    <Flex position="relative" justifyContent="center" alignItems="center" flexGrow={1}>
      {depth > 1 && (
        <ConditionView condition={condition} />
      )}
      <QuestionEntryViewContainer activeCTA={activeQuestion} id={question.id} flexGrow={1}>
        <QuestionEntryContainer flexGrow={1}>
          <DeleteCTAButton
            disabled={(!!activeQuestion && activeQuestion !== question.id) || false}
            onClick={() => null}
          >
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
              onAddExpandChange={onAddExpandChange}
              parentQuestionId={parentQuestionId}
              question={question}
              key={`form-${question.id}-${question.updatedAt}`}
              edgeId={edgeId}
              parentOptions={parentOptions}
              condition={condition}
              id={question.id}
              title={question.title}
              isRoot={question.isRoot}
              leafs={leafs}
              options={question?.options || []}
              overrideLeaf={question.overrideLeaf}
              type={activeType}
              onActiveQuestionChange={onActiveQuestionChange}
            />
          )}

        </QuestionEntryContainer>
      </QuestionEntryViewContainer>
      <LinkContainer hasCTA={!!question.overrideLeaf?.id}>
        <Flex
          flexDirection="column"
          padding="25px"
          minWidth="80px"
          color="black"
          justifyContent="center"
          alignItems="center"
        >
          {(!question.overrideLeaf?.type || question.overrideLeaf?.type === 'Link') && (
            <LinkIcon isCTA hasCTA />
          )}

          {question.overrideLeaf?.type === 'Opinion' && (
            <OpinionIcon isCTA hasCTA />
          )}

          {question.overrideLeaf?.type === 'Register' && (
            <RegisterIcon isCTA hasCTA />
          )}

          <TypeSpan fontSize="0.5em">
            {question.overrideLeaf?.type || 'None'}
          </TypeSpan>
        </Flex>
      </LinkContainer>
      {question.id !== '-1' && (
        <AddChildComponent
          amtChildren={question?.children?.length || 0}
          isExpanded={isExpanded}
          onExpandChange={onExpandChange}
        />
      )}
    </Flex>
  );
};

export default QuestionEntryItem;
