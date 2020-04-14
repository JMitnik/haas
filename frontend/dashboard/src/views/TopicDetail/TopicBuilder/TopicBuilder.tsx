import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ApolloError } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { H2, Loader, Div, Button } from '@haas/ui';
import { useParams, useHistory } from 'react-router-dom';
import updateTopicBuilder from '../../../mutations/updateTopicBuilder';
import { getTopicBuilderQuery } from '../../../queries/getQuestionnaireQuery';
import QuestionEntry from './QuestionEntry/QuestionEntry';
import { TopicBuilderView } from './TopicBuilderStyles';
import {
  QuestionEntryProps, EdgeChildProps,
  QuestionOptionProps,
} from './TopicBuilderInterfaces';

const TopicBuilder = () => {
  const { customerId, topicId } = useParams();
  const history = useHistory();
  const { loading, data } = useQuery(getTopicBuilderQuery, {
    variables: { topicId },
  });

  const [updateTopic] = useMutation(updateTopicBuilder, {
    onCompleted: () => {
      history.push(`/c/${customerId}/t/${topicId}/`);
    },
    refetchQueries: [{
      query: getTopicBuilderQuery,
      variables: {
        topicId,
      },
    }],
    onError: (serverError: ApolloError) => {
      // eslint-disable-next-line no-console
      console.log(serverError);
    },
  });

  const mapQuestionsInputData = (nodes: Array<QuestionEntryProps>) => {
    const questions = nodes?.filter((node) => !node.isLeaf);
    return questions?.map(({ id,
      title, isRoot, isLeaf, type, overrideLeaf, options, children }: QuestionEntryProps) => ({
      id,
      title,
      isRoot,
      isLeaf,
      type,
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

  const findLeafs = (nodes: Array<QuestionEntryProps>) => {
    const leafs = nodes?.filter((node) => node.isLeaf);
    const selectLeafs = leafs?.map((leaf) => ({ value: leaf.id, label: leaf.title }));
    selectLeafs?.unshift({ value: 'None', label: 'None' });
    return selectLeafs;
  };

  const topicBuilderData = data?.questionnaire;

  const selectLeafs = findLeafs(data?.questionnaire?.questions);

  const questionsData = mapQuestionsInputData(data?.questionnaire?.questions);
  const [questions, setQuestions] = useState(questionsData);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data?.questionnaire) {
      const questionData = mapQuestionsInputData(data?.questionnaire?.questions);
      setQuestions(questionData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!data || loading) {
    return <Loader />;
  }

  const handleTitleChange = (title: string, qIndex: number) => {
    setQuestions((questionsPrev: any) => {
      questionsPrev[qIndex].title = title;
      return [...questionsPrev];
    });
  };

  const handleIsRootQuestionChange = (isRoot: boolean, qIndex: number) => {
    setQuestions((questionsPrev: any) => {
      questionsPrev[qIndex].isRoot = isRoot;
      return [...questionsPrev];
    });
  };

  const handleLeafNodeChange = (leaf: any, qIndex: number) => {
    setQuestions((questionsPrev: any) => {
      const question = questionsPrev[qIndex];
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

  const handleQuestionTypeChange = (value: string, qIndex: number) => {
    setQuestions((questionsPrev: any) => {
      questionsPrev[qIndex].type = value;
      return [...questionsPrev];
    });
  };

  const handleAddQuestionOption = (value: Array<QuestionOptionProps>, qIndex: number) => {
    setQuestions((questionsPrev: any) => {
      questionsPrev[qIndex].options = value;
      return [...questionsPrev];
    });
  };

  const handleQuestionOptionsChange = (
    questionOptions: Array<QuestionOptionProps>, qIndex: number,
  ) => {
    setQuestions((questionsPrev: any) => {
      questionsPrev[qIndex].options = questionOptions;
      return [...questionsPrev];
    });
  };

  const handleEdgesChange = (children: Array<EdgeChildProps>, qIndex: number) => {
    setQuestions((questionsPrev: any) => {
      questionsPrev[qIndex].children = children;
      return [...questionsPrev];
    });
  };

  const handleAddQuestion = (event: any) => {
    event.preventDefault();
    setQuestions((questionsPrev: any) => [...questionsPrev, {
      id: uuidv4(),
      title: undefined,
      isRoot: false,
      isLeaf: false,
      options: [],
      type: undefined,
      overrideLeaf: undefined,
      children: undefined,
    }]);
  };

  return (
    <>
      <H2 color="default.text" fontWeight={400} mb={4}>
        Topic builder
      </H2>
      <TopicBuilderView>
        {
          (questions && questions.length === 0) && (
            <Div alignSelf="center">No question available...</Div>
          )
        }
        {
          questions && questions.map((question: QuestionEntryProps, index: number) => (
            <QuestionEntry
              onIsRootQuestionChange={handleIsRootQuestionChange}
              onLeafNodeChange={handleLeafNodeChange}
              onEdgesChange={handleEdgesChange}
              onAddQuestionOption={handleAddQuestionOption}
              onQuestionOptionsChange={handleQuestionOptionsChange}
              onQuestionTypeChange={handleQuestionTypeChange}
              onTitleChange={handleTitleChange}
              key={index}
              index={index}
              questionsQ={questions}
              question={question}
              leafs={selectLeafs}
            />
          ))
        }
        <Button
          brand="default"
          mt={2}
          ml={4}
          mr={4}
          onClick={handleAddQuestion}
        >
          Add new question
        </Button>
        <Button
          brand="primary"
          mt={2}
          ml={4}
          mr={4}
          onClick={(e) => {
            e.preventDefault();
            updateTopic(
              { variables: { id: topicBuilderData.id,
                topicData: { id: topicBuilderData.id, questions } } },
            );
          }}
        >
          Save topic
        </Button>
      </TopicBuilderView>
    </>
  );
};

export default TopicBuilder;
