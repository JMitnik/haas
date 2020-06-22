import { ApolloError } from 'apollo-boost';
import { Button, Div, H2, Loader } from '@haas/ui';
import {
  EdgeChildProps, QuestionEntryProps,
  QuestionOptionProps,
} from './TopicBuilderInterfaces';
import { TopicBuilderView } from './TopicBuilderStyles';
import { getTopicBuilderQuery } from '../../queries/getQuestionnaireQuery';
import { orderBy } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import QuestionEntry from './QuestionEntry/QuestionEntry';
import React, { useEffect, useState } from 'react';
import updateTopicBuilder from '../../mutations/updateTopicBuilder';

const TopicBuilder = () => {
  const { customerId, topicId } = useParams();
  const history = useHistory();
  const { loading, data } = useQuery(getTopicBuilderQuery, {
    variables: { topicId },
  });

  const [updateTopic] = useMutation(updateTopicBuilder, {
    onCompleted: () => {
      history.push(`/dashboard/c/${customerId}/t/${topicId}/`);
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
    let questions = nodes?.filter((node) => !node.isLeaf);
    questions = orderBy(questions, (question) => question.creationDate, ['asc']);
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
    const selectLeafs = nodes?.map((leaf) => ({ value: leaf.id, label: leaf.title }));
    selectLeafs?.unshift({ value: 'None', label: 'None' });
    return selectLeafs;
  };

  const topicBuilderData = data?.dialogue;
  const selectLeafs = findLeafs(data?.dialogue?.leafs);

  const questionsData = mapQuestionsInputData(data?.dialogue?.questions);
  const [questions, setQuestions] = useState(questionsData);
  const rootQuestion = questions && questions.filter((question) => question.isRoot);
  const [activeExpanded, setActiveExpanded] : [Array<string>, React.Dispatch<React.SetStateAction<string[]>>] = useState(['-1']);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data?.dialogue) {
      const questionData = mapQuestionsInputData(data?.dialogue?.questions);
      setQuestions(questionData);
      const rootQuestion = questionData && questionData.filter((question) => question.isRoot);
      setActiveExpanded(rootQuestion.map((question) => question.id));
    }
  }, [data]);

  if (!data || loading) {
    return <Loader />;
  }

  const handleOnQuestionExpandChange = (questionId: string) => setActiveExpanded((prevExpanded: Array<string>) => {
    if (!questionId) {
      return [...prevExpanded];
    }
    if (questionId && prevExpanded.includes(questionId)) {
      const collapseIndex: number = prevExpanded.indexOf(questionId);
      prevExpanded.splice(collapseIndex, 1);
      return [...prevExpanded];
    }
    return [questionId, ...prevExpanded];
  });

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

  return (
    <Div>
      <H2 color="default.text" fontWeight={400} mb={4}>
        Topic builder
      </H2>
      <TopicBuilderView>
        {
          (questions && questions.length === 0) && (
            <Div alignSelf="center">No question available...</Div>
          )
        }
        {rootQuestion && rootQuestion.map((question: QuestionEntryProps, index: number) => (
          <QuestionEntry
            activeExpanded={activeExpanded}
            setActiveExpanded={setActiveExpanded}
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
            leafs={selectLeafs}
          />
        ))}

      </TopicBuilderView>
      <Div display="flex" justifyContent="space-around">
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
    </Div>
  );
};

export default TopicBuilder;
