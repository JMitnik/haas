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

interface QuestionEntryExtendedProps extends QuestionEntryProps {
  icon: (props: any) => JSX.Element;
}

interface DialogueBuilderViewProps {
  nodes: Array<QuestionEntryExtendedProps>;
  selectLeafs: Array<{label: string | undefined, value: string}>;
  dialogueId: string;
}

const findLeafs = (nodes: Array<QuestionEntryProps>) => {
  const selectLeafs = nodes?.map((leaf) => ({ value: leaf.id, label: leaf.title }));
  selectLeafs?.unshift({ value: 'None', label: 'None' });
  return selectLeafs;
};

const mapQuestionsInputData = (nodes: Array<QuestionEntryProps>) => {
  let questions = nodes?.filter((node) => !node.isLeaf);
  questions = orderBy(questions, (question) => question.creationDate, ['asc']);
  return questions?.map(({ id,
    title, isRoot, isLeaf, type, overrideLeaf, options, children }) => ({
    id,
    title,
    isRoot,
    isLeaf,
    type,
    icon: type === 'MULTI_CHOICE' ? MultiChoiceBuilderIcon : HaasNodeIcon,
    overrideLeaf: !overrideLeaf
      ? undefined
      : { id: overrideLeaf?.id, title: overrideLeaf?.title, type: overrideLeaf?.type },
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
    variables: { dialogueSlug, customerSlug },
  });

  if (!data || loading) return <Loader />;
  const dialogueData = data?.customer?.dialogue;
  const selectLeafs = findLeafs(dialogueData?.leafs);
  const questionsData = mapQuestionsInputData(dialogueData?.questions);

  return <DialogueBuilderView dialogueId={dialogueData.id} selectLeafs={selectLeafs} nodes={questionsData} />;
};

const DialogueBuilderView = ({ nodes, selectLeafs, dialogueId }: DialogueBuilderViewProps) => {
  const { customerSlug, dialogueSlug } = useParams();
  const history = useHistory();

  const [questions, setQuestions] = useState(nodes);
  const [activeQuestion, setActiveQuestion] = useState<null | string>(null);

  const [updateTopic] = useMutation(updateTopicBuilder, {
    onCompleted: () => {
      history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}`);
    },
    refetchQueries: [{
      query: getTopicBuilderQuery,
      variables: {
        customerSlug,
        dialogueSlug,
      },
    }],
    onError: (serverError: ApolloError) => {
      // eslint-disable-next-line no-console
      console.log(serverError);
    },
  });

  const handleOnQuestionExpandChange = (questionId: string) => setActiveQuestion(
    (prevActiveQuestion) => {
      if (!questionId) {
        return prevActiveQuestion;
      }
      if (questionId && prevActiveQuestion === questionId) {
        return null;
      }
      return questionId;
    },
  );

  const handleTitleChange = (title: string, questionId: string) => {
    setQuestions((questionsPrev: any) => {
      const questionIds = questions.map((question) => question.id);
      const questionIndex = questionIds.indexOf(questionId);
      questionsPrev[questionIndex].title = title;
      return [...questionsPrev];
    });
  };

  const handleIsRootQuestionChange = (isRoot: boolean, questionId: string) => {
    setQuestions((questionsPrev: any) => {
      const questionIds = questions.map((question) => question.id);
      const questionIndex = questionIds.indexOf(questionId);
      questionsPrev[questionIndex].isRoot = isRoot;
      return [...questionsPrev];
    });
  };

  const handleLeafNodeChange = (leaf: any, questionId: string) => {
    setQuestions((questionsPrev: any) => {
      const questionIds = questions.map((question) => question.id);
      const questionIndex = questionIds.indexOf(questionId);
      const question = questionsPrev[questionIndex];
      if (question.overrideLeaf?.id) {
        if (leaf?.id === 'None') {
          question.overrideLeaf = undefined;
          return [...questionsPrev];
        }
      }
      question.overrideLeaf = leaf;
      return [...questionsPrev];
    });
  };

  const handleQuestionTypeChange = (value: string, questionId: string) => {
    setQuestions((questionsPrev: any) => {
      const questionIds = questions.map((question) => question.id);
      const questionIndex = questionIds.indexOf(questionId);
      questionsPrev[questionIndex].type = value;
      return [...questionsPrev];
    });
  };

  const handleAddQuestionOption = (value: Array<any>, questionId: string) => {
    setQuestions((questionsPrev: any) => {
      const questionIds = questions.map((question) => question.id);
      const questionIndex = questionIds.indexOf(questionId);
      questionsPrev[questionIndex].options = value;
      return [...questionsPrev];
    });
  };

  const handleQuestionOptionsChange = (
    questionOptions: Array<QuestionOptionProps>, questionId: string,
  ) => {
    setQuestions((questionsPrev: any) => {
      const questionIds = questions.map((question) => question.id);
      const questionIndex = questionIds.indexOf(questionId);
      questionsPrev[questionIndex].options = questionOptions;
      return [...questionsPrev];
    });
  };

  const handleEdgesChange = (children: Array<EdgeChildProps>, questionId: string) => {
    setQuestions((questionsPrev: any) => {
      const questionIds = questions.map((question) => question.id);
      const questionIndex = questionIds.indexOf(questionId);
      questionsPrev[questionIndex].children = children;
      return [...questionsPrev];
    });
  };

  const handleAddQuestion = (event: any, quesionUUID: string) => {
    event.preventDefault();
    setQuestions((questionsPrev: any) => [...questionsPrev, {
      id: quesionUUID,
      title: undefined,
      isRoot: false,
      isLeaf: false,
      options: [],
      type: undefined,
      overrideLeaf: undefined,
      children: undefined,
    }]);
  };

  const handleDeleteQuestion = (event: any, questionId: string) => {
    event.preventDefault();
    setQuestions((questionsPrev: any) => {
      const questionIds = questions.map((question) => question.id);
      const questionIndex = questionIds.indexOf(questionId);
      questionsPrev.splice(questionIndex, 1);
      return [...questionsPrev];
    });
  };

  console.log('Data:', questions);

  return (
    <DialogueBuilderContainer>
      <H2 color="default.text" fontWeight={400} mb={4}>
        Builder
      </H2>

      <ColumnFlex>
        {(questions && questions.length === 0) && (
          <Div alignSelf="center">No question available...</Div>
        )}

        {questions?.map((question: any, index: number) => (
          <QuestionEntry
            activeQuestion={activeQuestion}
            onActiveQuestionChange={setActiveQuestion}
            onQuestionExpandChange={handleOnQuestionExpandChange}
            onIsRootQuestionChange={handleIsRootQuestionChange}
            onLeafNodeChange={handleLeafNodeChange}
            onEdgesChange={handleEdgesChange}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onAddQuestionOption={handleAddQuestionOption}
            onQuestionOptionsChange={handleQuestionOptionsChange}
            onQuestionTypeChange={handleQuestionTypeChange}
            onTitleChange={handleTitleChange}
            key={index}
            index={index}
            questionsQ={questions}
            question={question}
            Icon={question.icon}
            leafs={selectLeafs}
          />
        ))}
      </ColumnFlex>

      <Div display="flex" mt={4} justifyContent="space-around">
        <Button
          brand="primary"
          mt={2}
          ml={4}
          mr={4}
          onClick={(e) => {
            e.preventDefault();
            updateTopic({
              variables: {
                customerSlug,
                dialogueSlug,
                topicData: {
                  id: dialogueId,
                  questions,
                },
              },
            });
          }}
        >
          Save dialogue
        </Button>
        <Button
          brand="default"
          mt={2}
          ml={4}
          mr={4}
          onClick={() => history.goBack()}
        >
          Cancel
        </Button>
      </Div>
    </DialogueBuilderContainer>
  );
};

export default DialogueBuilderPage;
