/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import { ApolloError } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { H2, Loader, Div, Button } from '@haas/ui';
import { useParams, useHistory } from 'react-router-dom';
import updateTopicBuilder from '../../../mutations/updateTopicBuilder';
import { getTopicBuilderQuery } from '../../../queries/getQuestionnaireQuery';
import QuestionEntry from './QuestionEntry/QuestionEntry';
import { TopicBuilderView } from './TopicBuilderStyles';
import { QuestionEntryProps, LeafProps, EdgeChildProps, QuestionOptionProps } from './TopicBuilderInterfaces';

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

  const mapQuestionsInputData = (questions: any) => questions?.map(({ id, title, isRoot, questionType, overrideLeaf, options, edgeChildren }: QuestionEntryProps) => ({
    id,
    title,
    isRoot,
    questionType,
    overrideLeaf: !overrideLeaf ? null : { id: overrideLeaf?.id, title: overrideLeaf?.title, type: overrideLeaf?.type },
    options: options?.map((option) => ({ id: option.id, value: option.value, publicValue: option.publicValue })),
    edgeChildren: edgeChildren?.map((edge: EdgeChildProps) => ({
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

  const topicBuilderData = data?.questionnaire;
  const leafs: Array<LeafProps> = topicBuilderData?.leafs;

  const selectLeafs = leafs?.map((leaf) => ({ value: leaf.id, label: leaf.title }));
  selectLeafs?.unshift({ value: 'None', label: 'None' });

  const questionsData = mapQuestionsInputData(data?.questionnaire?.questions);
  const [questions, setQuestions] = useState(questionsData);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data?.questionnaire) {
      setQuestions(questionsData || []);
    }
  }, [data]);

  if (!data || loading) {
    return <Loader />;
  }

  const onTitleChange = (title: string, qIndex: number) => {
    setQuestions((questionsPrev: Array<QuestionEntryProps>) => {
      questionsPrev[qIndex].title = title;
      return [...questionsPrev];
    });
  };

  const onIsRootQuestionChange = (isRoot: boolean, qIndex: number) => {
    setQuestions((questionsPrev: Array<QuestionEntryProps>) => {
      questionsPrev[qIndex].isRoot = isRoot;
      return [...questionsPrev];
    });
  };

  const onLeafNodeChange = (leafId: string, qIndex: number) => {
    setQuestions((questionsPrev: Array<QuestionEntryProps>) => {
      const question = questionsPrev?.[qIndex];
      if (question.overrideLeaf?.id) {
        if (leafId === 'None') {
          question.overrideLeaf = undefined;
          return [...questionsPrev];
        }
        question.overrideLeaf.id = leafId;
        return [...questionsPrev];
      }
      question.overrideLeaf = { id: leafId };
      return [...questionsPrev];
    });
  };

  const onQuestionTypeChange = (value: string, qIndex: number) => {
    setQuestions((questionsPrev: Array<QuestionEntryProps>) => {
      questionsPrev[qIndex].questionType = value;
      return [...questionsPrev];
    });
  };

  const onAddQuestionOption = (value: Array<QuestionOptionProps>, qIndex: number) => {
    setQuestions((questionsPrev: Array<QuestionEntryProps>) => {
      questionsPrev[qIndex].options = value;
      return [...questionsPrev];
    });
  };

  const onQuestionOptionsChange = (questionOptions: Array<QuestionOptionProps>, qIndex: number) => {
    setQuestions((questionsPrev: Array<QuestionEntryProps>) => {
      questionsPrev[qIndex].options = questionOptions;
      return [...questionsPrev];
    });
  };

  const onEdgesChange = (edgeChildren: Array<EdgeChildProps>, qIndex: number) => {
    setQuestions((questionsPrev: Array<QuestionEntryProps>) => {
      questionsPrev[qIndex].edgeChildren = edgeChildren;
      return [...questionsPrev];
    });
  };

  const onAddQuestion = (event: any) => {
    event.preventDefault();
    setQuestions((questionsPrev: any) => [...questionsPrev, {
      id: undefined,
      title: undefined,
      isRoot: false,
      options: [],
      questionType: undefined,
      overrideLeaf: undefined,
      edgeChildren: undefined,
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
            questions && questions.map((question: QuestionEntryProps, index: number) => <QuestionEntry onIsRootQuestionChange={onIsRootQuestionChange} onLeafNodeChange={onLeafNodeChange} onEdgesChange={onEdgesChange} onAddQuestionOption={onAddQuestionOption} onQuestionOptionsChange={onQuestionOptionsChange} onQuestionTypeChange={onQuestionTypeChange} onTitleChange={onTitleChange} key={index} index={index} questionsQ={questions} question={question} leafs={selectLeafs} />)
          }
        <Button brand="default" mt={2} ml={4} mr={4} onClick={(e) => onAddQuestion(e)}>Add new question</Button>
        <Button
          brand="primary"
          mt={2}
          ml={4}
          mr={4}
          onClick={
              (e) => {
                e.preventDefault();
                updateTopic({ variables: { id: topicBuilderData.id, topicData: { id: topicBuilderData.id, questions } } });
              }
            }
        >
          Save topic
        </Button>
      </TopicBuilderView>
    </>
  );
};

export default TopicBuilder;
