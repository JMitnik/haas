import * as UI from '@haas/ui';
import { Zap } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { CTANode, QuestionEntryProps } from './DialogueBuilderInterfaces';
import { useFieldArray, useForm } from 'react-hook-form';
import QuestionSection from './components/QuestionSection';

interface QuestionEntryExtendedProps extends QuestionEntryProps {
  icon: (props: any) => JSX.Element;
}

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

  const { t } = useTranslation();

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

  console.log('Questions field array: ', questionsFieldArray);

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
            />
          )}
        </UI.ColumnFlex>
      </UI.ViewBody>
    </>
  );
};

export default DialogueBuilderView;
