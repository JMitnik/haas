import { Flex, Span } from '@haas/ui';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import { useCustomer } from 'providers/CustomerProvider';
import EditButton from 'components/EditButton';
import deleteQuestionMutation from 'mutations/deleteQuestion';

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
  const { activeCustomer } = useCustomer();
  const { dialogueSlug } = useParams<{ dialogueSlug: string }>();
  const { t } = useTranslation();
  const toast = useToast();

  const [deleteQuestion] = useMutation(deleteQuestionMutation, {
    variables: {
      input: {
        id: question.id,
        customerId: activeCustomer?.id,
        dialogueSlug,
      },
    },
    refetchQueries: [{
      query: getTopicBuilderQuery,
      variables: {
        customerSlug: activeCustomer?.slug,
        dialogueSlug,
      },
    }],
    onCompleted: () => {
      toast({
        title: t('toast:delete_node'),
        description: t('toast:delete_node_helper'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
      onActiveQuestionChange(null);
    },
    onError: () => {
      toast({
        title: t('toast:something_went_wrong'),
        description: t('toast:delete_node_error_helper'),
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
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
                {t('title')}
              </Span>
              <OverflowSpan data-cy="OverflowSpan">
                {question.title || t('none')}
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
