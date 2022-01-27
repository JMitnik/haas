import * as UI from '@haas/ui';
import { Zap } from 'react-feather';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';

import { useCustomer } from 'providers/CustomerProvider';
import { useSetQuestionOrderMutation } from 'types/generated-types';
import getTopicBuilderQuery from 'queries/getQuestionnaireQuery';

import { CTANode, QuestionEntryExtendedProps } from './DialogueBuilderInterfaces';
import QuestionSection from './components/QuestionSection';

interface DialogueBuilderViewProps {
  nodes: Array<QuestionEntryExtendedProps>;
  root: QuestionEntryExtendedProps | undefined;
  ctaNodes: CTANode[];
  selectLeafs: Array<{ label: string | undefined, value: string }>;
  // eslint-disable-next-line react/no-unused-prop-types
  dialogueId: string;
}

const DialogueBuilderView = ({ nodes, selectLeafs, ctaNodes, root }: DialogueBuilderViewProps) => {
  const [activeQuestion, setActiveQuestion] = useState<null | string>(null);
  const toast = useToast();
  const { activeCustomer } = useCustomer();
  const { dialogueSlug } = useParams<{ dialogueSlug: string }>();
  const { t } = useTranslation();
  const isFirst = useRef(true);

  const [setQuestionOrder] = useSetQuestionOrderMutation({
    refetchQueries: [{
      query: getTopicBuilderQuery,
      variables: {
        customerSlug: activeCustomer?.slug,
        dialogueSlug,
      },
    }],
    onCompleted: () => {
      toast({
        title: t('toast:moved_question'),
        description: t('toast:moved_question_helper'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
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

  const form = useForm({
    defaultValues: {
      nodes,
    },
  });

  const questionsFieldArray = useFieldArray({
    name: 'nodes',
    control: form.control,
    keyName: 'indexKey',
  });

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const mappedQuestions = questionsFieldArray.fields.map(
      (field, indexPosition) => ({ id: field.id as string, position: indexPosition }),
    );

    setQuestionOrder({
      variables: {
        input: {
          customerId: activeCustomer?.id as string,
          dialogueSlug,
          positions: mappedQuestions,
        },
      },
    });
  }, [questionsFieldArray.fields]);

  return (
    <>
      <UI.ViewHead>
        <UI.ViewTitle>
          <UI.Icon as={Zap} mr={1} />
          {t('views:builder_view')}
        </UI.ViewTitle>
      </UI.ViewHead>

      <UI.ViewBody>
        <UI.ColumnFlex>
          {(nodes && nodes.length === 0) && (
            <UI.Div alignSelf="center">No question available...</UI.Div>
          )}

          {root && (
            <QuestionSection
              parentQuestionType=""
              edgeId={undefined}
              options={root.options}
              condition={undefined}
              depth={1}
              activeQuestion={activeQuestion}
              onActiveQuestionChange={setActiveQuestion}
              onAddQuestion={undefined}
              onDeleteQuestion={undefined}
              key={`${root.id}-${root.updatedAt}`}
              index={0}
              questionsQ={nodes}
              question={root}
              Icon={root.icon}
              leafs={selectLeafs}
              ctaNodes={ctaNodes}
              amtSiblings={0}
              questionsFieldArray={questionsFieldArray}
            />

          )}
        </UI.ColumnFlex>
      </UI.ViewBody>
    </>
  );
};

export default DialogueBuilderView;
