import { orderBy } from 'lodash';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import { EdgeChildProps, QuestionEntryProps } from 'views/DialogueBuilderView/DialogueBuilderInterfaces';
import { Loader } from '@haas/ui';
import DialogueBuilderView from 'views/DialogueBuilderView/DialogueBuilderView';
import HaasNodeIcon from 'components/Icons/HaasNodeIcon';
import MultiChoiceBuilderIcon from 'components/Icons/MultiChoiceBuilderIcon';
import getTopicBuilderQuery from 'queries/getQuestionnaireQuery';

const initializeQuestionType = (type?: string) => {
  if (type === 'SLIDER') {
    return 'Slider';
  }

  if (type === 'CHOICE') {
    return 'Choice';
  }

  return 'Unknown';
};

const initializeCTAType = (type?: string) => {
  if (type === 'TEXTBOX') {
    return 'Opinion';
  }

  if (type === 'REGISTRATION') {
    return 'Register';
  }

  if (type === 'LINK') {
    return 'Link';
  }

  if (type === 'SHARE') {
    return 'Share';
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

  return questions?.map(({ id, title, isRoot, isLeaf, type, overrideLeaf, options, children, updatedAt, sliderNode }) => ({
    id,
    updatedAt,
    title,
    isRoot,
    isLeaf,
    type: initializeQuestionType(type),
    sliderNode,
    icon: type === 'CHOICE' ? MultiChoiceBuilderIcon : HaasNodeIcon,
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
  const questionsData = mapQuestionsInputData(dialogueData?.questions);
  const rootQuestionNode = questionsData.find((question) => question.isRoot);

  return (
    <DialogueBuilderView
      root={rootQuestionNode}
      dialogueId={dialogueData.id}
      selectLeafs={selectLeafs}
      nodes={questionsData}
    />
  );
};

export default DialogueBuilderPage;
