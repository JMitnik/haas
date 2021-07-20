import * as UI from '@haas/ui';
import { Flex, Span } from '@haas/ui';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';

import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import { useCloneQuestionMutation } from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';
import ShowMoreButton from 'components/ShowMoreButton';
import deleteQuestionMutation from 'mutations/deleteQuestion';
import useAuth from 'hooks/useAuth';

import { QuestionNodeProblem } from 'views/DialogueBuilderView/DialogueBuilderTypes';

import { CTANode, EdgeConditionProps, QuestionEntryProps, QuestionOptionProps } from '../../DialogueBuilderInterfaces';
import { OverflowSpan, QuestionEntryContainer, QuestionEntryViewContainer } from './QuestionEntryStyles';
import BuilderIcon from './BuilderIcon';
import CTALabel from './CTALabel';
import ConditionLabel from './ConditionLabel';
import DialogueBuilderQuestionForm from '../QuestionEntryForm/DialogueBuilderQuestionForm';
import ShowChildQuestion from './ShowChildQuestion';

interface QuestionEntryItemProps {
  onAddExpandChange?: React.Dispatch<React.SetStateAction<boolean>>;
  onExpandChange: () => void;
  isExpanded: Boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  questionsQ: Array<QuestionEntryProps>;
  question: QuestionEntryProps;
  leafs: any;
  // eslint-disable-next-line react/no-unused-prop-types
  index: number;
  Icon: (props: any) => JSX.Element;
  activeQuestion: string | null;
  // eslint-disable-next-line react/no-unused-prop-types
  onAddQuestion?: (event: any, questionUUID: string) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onDeleteQuestion?: (event: any, questionId: string) => void;
  onActiveQuestionChange: React.Dispatch<React.SetStateAction<string | null>>;
  condition: EdgeConditionProps | undefined;
  parentOptions: QuestionOptionProps[] | undefined;
  edgeId: string | undefined;
  parentQuestionId?: string;
  depth: number;
  parentQuestionType: string;
  ctaNodes: CTANode[];
  problems: (QuestionNodeProblem | undefined)[];
}

interface QuestionOptionsOverlayProps {
  onClone: (e: React.MouseEvent<HTMLElement>) => void;
}

const QuestionOptionsOverlay = ({ onClone }: QuestionOptionsOverlayProps) => {
  const { t } = useTranslation();

  return (
    <UI.List>
      <UI.ListHeader>{t('edit_question')}</UI.ListHeader>
      <UI.ListItem onClick={onClone}>
        {t('clone')}
      </UI.ListItem>
    </UI.List>
  );
};

const getSelectEntry = (type: string) => {
  switch (type) {
    case 'Choice':
      return { label: type, value: 'CHOICE' };
    case 'Video embedded':
      return { label: type, value: 'VIDEO_EMBEDDED' };
    default:
      return { label: type, value: 'SLIDER' };
  }
};

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
  ctaNodes,
  onAddExpandChange,
  problems } : QuestionEntryItemProps) => {
  const { activeCustomer } = useCustomer();
  const { dialogueSlug } = useParams<{ dialogueSlug: string }>();
  const { canAccessAdmin } = useAuth();
  const { t } = useTranslation();
  const toast = useToast();
  const questionRef = useRef<HTMLDivElement | null>(null);
  const [cloneQuestion] = useCloneQuestionMutation({
    refetchQueries: [{
      query: getTopicBuilderQuery,
      variables: {
        customerSlug: activeCustomer?.slug,
        dialogueSlug,
      },
    }],
    onCompleted: () => {
      toast({
        title: t('toast:branch_cloned'),
        description: t('toast:branch_clone_helper'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
      onActiveQuestionChange(null);
    },
    onError: (err: Error) => {
      console.log('Error: ', err);
      toast({
        title: t('toast:something_went_wrong'),
        description: t('toast:delete_node_error_helper'),
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

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

  const activeType = getSelectEntry(question.type);

  const handleScroll = () => {
    questionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClone = (questionId: string) => {
    cloneQuestion({
      variables: {
        questionId,
      },
    });
  };

  return (
    <Flex
      ref={questionRef}
      data-cy="QuestionEntry"
      position="relative"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
    >
      {depth > 1 && (
        <ConditionLabel
          activeCTA={activeQuestion}
          id={question.id}
          condition={condition}
          problems={problems}
        />
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
                <ReactMarkdown>
                  {question.title || t('none') || ''}
                </ReactMarkdown>
              </OverflowSpan>
            </Flex>

            <Flex width="30%" alignItems="center" justifyContent="center">
              <UI.Button
                variant="outline"
                variantColor="teal"
                size="sm"
                isDisabled={(activeQuestion && activeQuestion !== question.id) || false}
                onClick={() => onActiveQuestionChange(question.id)}
              >
                {t('edit')}
              </UI.Button>
            </Flex>

            <UI.Div alignSelf="center">
              {canAccessAdmin && depth > 1 && (
                <ShowMoreButton
                  renderMenu={(
                    <QuestionOptionsOverlay
                      onClone={() => handleClone(question.id)}
                    />
                  )}
                />
              )}
            </UI.Div>

          </Flex>
          {activeQuestion === question.id && (
            <DialogueBuilderQuestionForm
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
              ctaNodes={ctaNodes}
              options={question?.options || []}
              overrideLeaf={question.overrideLeaf}
              type={activeType}
              onActiveQuestionChange={onActiveQuestionChange}
              onScroll={handleScroll}
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
