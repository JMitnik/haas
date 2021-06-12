import { orderBy } from 'lodash';
import { useQuery } from '@apollo/client';
import React from 'react';

import {
  EdgeChildProps,
  QuestionEntryProps,
} from 'views/DialogueBuilderView/DialogueBuilderInterfaces';
import { Loader } from '@haas/ui';
import { useNavigator } from 'hooks/useNavigator';
import DialogueBuilderView from 'views/DialogueBuilderView/DialogueBuilderView';
import HaasNodeIcon from 'components/Icons/HaasNodeIcon';
import MultiChoiceBuilderIcon from 'components/Icons/MultiChoiceBuilderIcon';
import VideoIcon from 'components/Icons/VideoIcon';
import getTopicBuilderQuery from 'queries/getQuestionnaireQuery';

const initializeQuestionType = (type?: string) => {
  if (type === 'SLIDER') {
    return 'Slider';
  }

  if (type === 'CHOICE') {
    return 'Choice';
  }

  if (type === 'VIDEO_EMBEDDED') {
    return 'Video embedded';
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

  if (type === 'FORM') {
    return 'Form';
  }

  return 'None';
};

const findLeafs = (nodes: QuestionEntryProps[]) => {
  const selectLeafs = nodes?.map((leaf) => ({ value: leaf.id, label: leaf.title }));
  selectLeafs?.unshift({ value: '', label: 'None' });
  return selectLeafs;
};

const getIcon = (questionType: string) => {
  switch (questionType) {
    case 'CHOICE':
      return MultiChoiceBuilderIcon;
    case 'VIDEO_EMBEDDED':
      return VideoIcon;
    default:
      return HaasNodeIcon;
  }
};

const mapQuestionsInputData = (nodes: QuestionEntryProps[]) => {
  let questions = nodes?.filter((node) => !node.isLeaf);
  questions = orderBy(questions, (question) => question.creationDate, ['asc']);

  return (
    questions?.map(
      ({
        id,
        title,
        isRoot,
        isLeaf,
        type,
        overrideLeaf,
        options,
        children,
        updatedAt,
        sliderNode,
        extraContent,
      }) => ({
        id,
        updatedAt,
        title,
        isRoot,
        isLeaf,
        extraContent,
        type: initializeQuestionType(type),
        sliderNode,
        icon: getIcon(type),
        overrideLeaf: !overrideLeaf
          ? undefined
          : {
            id: overrideLeaf?.id,
            title: overrideLeaf?.title,
            type: initializeCTAType(overrideLeaf?.type),
          },
        options: options?.map((option) => ({
          id: option.id,
          value: option.value,
          publicValue: option.publicValue,
          overrideLeaf: option.overrideLeaf,
        })),
        children: children?.map((edge: EdgeChildProps) => ({
          id: edge.id,
          parentNode: { id: edge?.parentNode?.id, title: edge?.parentNode?.title },
          conditions: [
            {
              id: edge?.conditions?.[0]?.id,
              conditionType: edge?.conditions?.[0]?.conditionType,
              matchValue: edge?.conditions?.[0]?.matchValue,
              renderMin: edge?.conditions?.[0]?.renderMin,
              renderMax: edge?.conditions?.[0]?.renderMax,
            },
          ],
          childNode: { id: edge?.childNode?.id, title: edge?.childNode?.title },
        })),
      }),
    ) || []
  );
};

const DialogueBuilderPage = () => {
  const { customerSlug, dialogueSlug } = useNavigator();
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
      ctaNodes={dialogueData?.leafs}
      nodes={questionsData}
    />
  );
};

export default DialogueBuilderPage;
