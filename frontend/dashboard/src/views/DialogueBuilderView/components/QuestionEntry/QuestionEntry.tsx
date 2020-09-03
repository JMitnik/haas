import { ApolloError } from 'apollo-client';
import { Flex, Span } from '@haas/ui';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import React from 'react';

import EditButton from 'components/EditButton';
import deleteQuestionMutation from 'mutations/deleteQuestion';
import getTopicBuilderQuery from 'queries/getQuestionnaireQuery';

import { EdgeConditonProps, QuestionEntryProps, QuestionOptionProps } from '../../DialogueBuilderInterfaces';
import { OverflowSpan, QuestionEntryContainer, QuestionEntryViewContainer } from './QuestionEntryStyles';
import BuilderIcon from './BuilderIcon';
import CTALabel from './CTALabel';
import ConditionLabel from './ConditionLabel';
import QuestionEntryForm from '../QuestionEntryForm/QuestionEntryForm';
import ShowChildQuestion from './ShowChildQuestion';

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
  parentQuestionType: string;
}

const QuestionEntryItem = ({ depth,
  parentQuestionType,
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
: QuestionEntryItemProps) => {
  const { customerSlug, dialogueSlug } = useParams();

  const [deleteQuestion] = useMutation(deleteQuestionMutation, {
    variables: {
      id: question.id,
      customerSlug,
      dialogueSlug,
    },
    refetchQueries: [{
      query: getTopicBuilderQuery,
      variables: {
        customerSlug,
        dialogueSlug,
      },
    }],
    onCompleted: () => {
      // Deze
      onActiveQuestionChange(null);
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const activeType = question.type === 'Choice'
    ? { label: question.type, value: 'CHOICE' }
    : { label: 'Slider', value: 'SLIDER' };

  return (
    <Flex data-cy="QuestionEntry" position="relative" justifyContent="center" alignItems="center" flexGrow={1}>
      {depth > 1 && (
        <ConditionLabel activeCTA={activeQuestion} id={question.id} condition={condition} />
      )}
      <QuestionEntryViewContainer activeCTA={activeQuestion} id={question.id} flexGrow={1}>
        <QuestionEntryContainer flexGrow={1}>

          <Flex flexDirection="row" width="100%">
            <BuilderIcon type={question.type} Icon={Icon} />

            <Flex width="60%" flexDirection="column">
              <Span fontSize="1.4em">
                Title
              </Span>
              <OverflowSpan data-cy="OverflowSpan">
                {question.title || 'None'}
              </OverflowSpan>
            </Flex>

            <Flex width="30%" alignItems="center" justifyContent="center">
              <EditButton
                isDisabled={(activeQuestion && activeQuestion !== question.id) || false}
                onClick={() => onActiveQuestionChange(question.id)}
              />
            </Flex>

          </Flex>
          {activeQuestion === question.id && (
            <QuestionEntryForm
              onDeleteEntry={deleteQuestion}
              onAddExpandChange={onAddExpandChange}
              parentQuestionType={parentQuestionType}
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

      <CTALabel question={question} />

      {question.id !== '-1' && (
        <ShowChildQuestion
          amtChildren={question?.children?.length || 0}
          isDisabled={!!activeQuestion && activeQuestion !== question.id}
          isExpanded={isExpanded}
          onExpandChange={onExpandChange}
        />
      )}
    </Flex>
  );
};

export default QuestionEntryItem;
