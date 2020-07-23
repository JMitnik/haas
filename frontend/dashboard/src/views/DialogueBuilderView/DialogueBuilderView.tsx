import { ColumnFlex, Div, H2 } from '@haas/ui';

import React, { useState } from 'react';

import { DialogueBuilderContainer } from './DialogueBuilderStyles';
import { QuestionEntryProps } from './DialogueBuilderInterfaces';

import QuestionSection from './components/QuestionSection';

interface QuestionEntryExtendedProps extends QuestionEntryProps {
  icon: (props: any) => JSX.Element;
}

interface DialogueBuilderViewProps {
  nodes: Array<QuestionEntryExtendedProps>;
  root: QuestionEntryExtendedProps | undefined;
  selectLeafs: Array<{label: string | undefined, value: string}>;
  dialogueId: string;
}

const DialogueBuilderView = ({ nodes, selectLeafs, root }: DialogueBuilderViewProps) => {
  const [activeQuestion, setActiveQuestion] = useState<null | string>(null);

  return (
    <DialogueBuilderContainer>
      <H2 color="default.text" fontWeight={400} mb={4}>
        Builder
      </H2>

      <ColumnFlex>
        {(nodes && nodes.length === 0) && (
          <Div alignSelf="center">No question available...</Div>
        )}

        {root && (
        <QuestionSection
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
        />
        )}
      </ColumnFlex>
    </DialogueBuilderContainer>
  );
};

export default DialogueBuilderView;
