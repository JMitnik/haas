import { ApolloError } from 'apollo-boost';
import { Button, ColumnFlex, Div, H2, Loader } from '@haas/ui';
import { orderBy } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';

import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import HaasNodeIcon from 'components/Icons/HaasNodeIcon';
import MultiChoiceBuilderIcon from 'components/Icons/MultiChoiceBuilderIcon';
import updateTopicBuilder from 'mutations/updateTopicBuilder';

import { DialogueBuilderContainer } from './DialogueBuilderStyles';
import {
  EdgeChildProps, QuestionEntryProps,
  QuestionOptionProps,
} from './TopicBuilderInterfaces';

import QuestionEntry from './QuestionEntry/QuestionEntry';
import QuestionSection from './QuestionEntry/QuestionSection';

interface QuestionEntryExtendedProps extends QuestionEntryProps {
  icon: (props: any) => JSX.Element;
}

interface DialogueBuilderViewProps {
  nodes: Array<QuestionEntryExtendedProps>;
  root: QuestionEntryExtendedProps | undefined;
  selectLeafs: Array<{label: string | undefined, value: string}>;
  dialogueId: string;
}

const initializeQuestionType = (type?: string) => {
  if (type === 'SLIDER') {
    return 'Slider';
  }

  if (type === 'MULTI_CHOICE') {
    return 'Multi-Choice';
  }

  return 'Unknown';
};

const initializeCTAType = (type?: string) => {
  if (type === 'OPINION') {
    return 'Opinion';
  }

  if (type === 'REGISTRATION') {
    return 'Register';
  }

  if (type === 'SOCIAL_SHARE') {
    return 'Link';
  }

  return 'None';
};

const findLeafs = (nodes: Array<QuestionEntryProps>) => {
  const selectLeafs = nodes?.map((leaf) => ({ value: leaf.id, label: leaf.title }));
  selectLeafs?.unshift({ value: '', label: 'None' });
  return selectLeafs;
};

const mapQuestionsInputData = (nodes: Array<QuestionEntryProps>) => {
  let questions = nodes?.filter((node) => !node.isLeaf);
  questions = orderBy(questions, (question) => question.creationDate, ['asc']);
  return questions?.map(({ id,
    title, isRoot, isLeaf, type, overrideLeaf, options, children, updatedAt }) => ({
    id,
    updatedAt,
    title,
    isRoot,
    isLeaf,
    type: initializeQuestionType(type),
    icon: type === 'MULTI_CHOICE' ? MultiChoiceBuilderIcon : HaasNodeIcon,
    overrideLeaf: !overrideLeaf
      ? undefined
      : { id: overrideLeaf?.id, title: overrideLeaf?.title, type: initializeCTAType(overrideLeaf?.type) },
    options: options?.map((option) => (
      { id: option.id, value: option.value, publicValue: option.publicValue })),
    children: children?.map((edge: EdgeChildProps) => ({
      id: edge.id,
      parentNode: { id: edge?.parentNode?.id, title: edge?.parentNode?.title },
      conditions: [{
        id: edge?.conditions?.[0]?.id,
        conditionType: edge?.conditions?.[0]?.conditionType,
        matchValue: edge?.conditions?.[0]?.matchValue,
        renderMin: edge?.conditions?.[0]?.renderMin,
        renderMax: edge?.conditions?.[0]?.renderMax,
      }],
      childNode: { id: edge?.childNode?.id, title: edge?.childNode?.title },
    })),
  })) || [];
};

const DialogueBuilderPage = () => {
  const { customerSlug, dialogueSlug } = useParams();
  const { loading, data } = useQuery(getTopicBuilderQuery, {
    fetchPolicy: 'network-only',
    variables: { dialogueSlug, customerSlug },
  });

  if (!data || loading) return <Loader />;
  const dialogueData = data?.customer?.dialogue;
  const selectLeafs = findLeafs(dialogueData?.leafs);
  console.log('DIALOGUE PAGE PREMAP:', dialogueData?.questions);
  const questionsData = mapQuestionsInputData(dialogueData?.questions);
  const rootQuestionNode = questionsData.find((question) => question.isRoot);

  console.log('Mapped Data:', questionsData);

  return (
    <DialogueBuilderView
      root={rootQuestionNode}
      dialogueId={dialogueData.id}
      selectLeafs={selectLeafs}
      nodes={questionsData}
    />
  );
};

const DialogueBuilderView = ({ nodes, selectLeafs, root }: DialogueBuilderViewProps) => {
  const [activeQuestion, setActiveQuestion] = useState<null | string>(null);

  // const handleAddQuestion = (event: any, quesionUUID: string) => {
  //   event.preventDefault();
  //   setQuestions((questionsPrev: any) => [...questionsPrev, {
  //     id: quesionUUID,
  //     title: undefined,
  //     isRoot: false,
  //     isLeaf: false,
  //     options: [],
  //     type: undefined,
  //     overrideLeaf: undefined,
  //     children: undefined,
  //   }]);
  // };

  // const handleDeleteQuestion = (event: any, questionId: string) => {
  //   event.preventDefault();
  //   setQuestions((questionsPrev: any) => {
  //     const questionIds = questions.map((question) => question.id);
  //     const questionIndex = questionIds.indexOf(questionId);
  //     questionsPrev.splice(questionIndex, 1);
  //     return [...questionsPrev];
  //   });
  // };

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

export default DialogueBuilderPage;
