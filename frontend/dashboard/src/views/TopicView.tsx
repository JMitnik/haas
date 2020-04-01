/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ChevronRight, Plus, X, MinusCircle } from 'react-feather';
import { H2, Flex, Muted, Loader, Grid, Div, H5, H4, H3, Button } from '@haas/ui';
import styled, { css } from 'styled-components/macro';
import { useParams, Switch, Route, useHistory } from 'react-router-dom';
import Select, { ActionMeta } from 'react-select';
import { useForm } from 'react-hook-form';
import getQuestionnaireData from '../queries/getQuestionnaireData';
import getTopicBuilderQuery from '../queries/getQuestionnaireQuery';
import getSessionAnswerFlow from '../queries/getSessionAnswerFlow';
import { Activity } from 'react-feather';

interface TimelineEntryProps {
  sessionId: string;
  value: number;
  createdAt: string;
}

interface QuestionnaireDetailResult {
  customerName: string;
  title: string;
  description: string;
  creationDate: string;
  updatedAt: string;
  average: string;
  totalNodeEntries: number;
  timelineEntries?: Array<TimelineEntryProps>
}

interface NodeEntryValueProps {
  numberValue?: number;
  textValue?: string;
  id: string;
}

interface RelatedNodeProps {
  title: string;
}

interface NodeEntryProps {
  values: Array<NodeEntryValueProps>;
  relatedNode: RelatedNodeProps;
}

const monthMap = new Map([
  [0, 'JAN'],
  [1, 'FEB'],
  [2, 'MAR'],
  [3, 'APR'],
  [4, 'MAY'],
  [5, 'JUN'],
  [6, 'JUL'],
  [7, 'AUG'],
  [8, 'SEP'],
  [9, 'OCT'],
  [10, 'NOV'],
  [11, 'DEC'],
]);

const TopicView = () => {
  const { customerId, topicId } = useParams();
  const [currSession, setCurrSession] = useState('');
  const history = useHistory();
  const { loading, data } = useQuery(getQuestionnaireData, {
    variables: { topicId },
  });

  if (loading) return <Loader />;

  const resultData = data?.getQuestionnaireData;

  return (
    <>
      <Div width="80%" margin="0 auto">
        <Grid gridTemplateColumns="3fr 1fr">
          <Div>
            <Flex height="100%" alignItems="center" justifyContent="space-between" flexDirection="column">
              <Switch>
                <Route path="/c/:customerId/t/:topicId/e/:entryId">
                  <TopicAnswerFlow sessionId={currSession} />
                </Route>
                <Route path="/c/:customerId/t/:topicId/topic-builder/">
                  <TopicBuilderContent />
                </Route>
                <Route>
                  <TopicDetails QuestionnaireDetailResult={resultData} />
                  <button type="button" onClick={() => history.push(`/c/${customerId}/t/${topicId}/topic-builder/`)}>Go to topic builder</button>
                </Route>
              </Switch>
            </Flex>
          </Div>
          <Div>
            <HistoryLog
              setCurrSession={setCurrSession}
              timelineEntries={resultData?.timelineEntries}
            />
          </Div>
        </Grid>
      </Div>
    </>
  );
};

interface OverrideLeafProps {
  id?: string;
  type?: string;
  title?: string;
}
interface QuestionEntryProps {
  id?: string;
  title?: string;
  isRoot?: boolean;
  questionType?: string;
  overrideLeaf?: OverrideLeafProps;
  edgeChildren?: Array<EdgeChildProps>;
  options?: Array<QuestionOptionProps>;
}

interface QuestionOptionProps {
  value: string;
  publicValue?: string;
}

interface EdgeChildProps {
  id?: string;
  conditions: Array<EdgeConditonProps>;
  parentNode: QuestionEntryProps;
  childNode: QuestionEntryProps;
}

interface EdgeConditonProps {
  id?: string;
  conditionType?: string;
  renderMin?: number;
  renderMax?: number;
  matchValue?: string;
}

const DeleteCustomerButtonContainer = styled.button`
  position: absolute;
  top: 10px;
  right: 0px;
  background: none;
  border: none;
  opacity: 0.1;
  cursor: pointer;
  transition: all 0.2s ease-in;

  &:hover {
    transition: all 0.2s ease-in;
    opacity: 0.8;
  }
`;

const DeleteQuestionOptionButtonContainer = styled.button`
  background: none;
  border: none;
  opacity: 0.1;
  cursor: pointer;
  transition: all 0.2s ease-in;
  margin-left: 1%;

  &:hover {
    transition: all 0.2s ease-in;
    opacity: 0.8;
  }
`;

const conditionTypes = [{ value: 'match', label: 'match' }, { value: 'valueBoundary', label: 'valueBoundary' }];

const EdgeEntry = ({ questions, edge, index, setCurrEdges, onEdgesChange, setConditionType, setChildQuestionNode, setEdgeConditionMinValue, setEdgeConditionMaxValue, setEdgeConditionMatchValue }: {
  questions: Array<QuestionEntryProps>, edge: EdgeChildProps, index: number, setCurrEdges: React.Dispatch<React.SetStateAction<EdgeChildProps[]>>,
  onEdgesChange: Function, setConditionType: Function, setChildQuestionNode: Function, setEdgeConditionMinValue: Function, setEdgeConditionMaxValue: Function, setEdgeConditionMatchValue: Function
}) => {

  const [currCondition, setCurrCondition] = useState({ value: edge?.conditions?.[0]?.conditionType, label: edge?.conditions?.[0]?.conditionType });
  const [currChildQuestion, setCurrChildQuestion] = useState({ value: edge?.childNode?.id, label: `${edge?.childNode?.title} - ${edge?.childNode?.id}` });

  const setCondition = (qOption: any) => {
    const { label, value } = qOption;
    setCurrCondition({ label, value });
    setConditionType(value, index);
  };

  const setChildQuestion = (childQuestion: any) => {
    const { label, value }: { label: string, value: string } = childQuestion;
    const strippedLabel = label.split('-')?.[0]?.trim();
    setCurrChildQuestion({ label, value });
    setChildQuestionNode({ title: strippedLabel, id: value }, index);
  };

  const setMinValue = (event: React.FocusEvent<HTMLInputElement>) => {
    const minValue = Number(event.target.value);
    setEdgeConditionMinValue(minValue, index);
  };

  const setMaxValue = (event: React.FocusEvent<HTMLInputElement>) => {
    const maxValue = Number(event.target.value);
    setEdgeConditionMaxValue(maxValue, index);
  };

  const newSelect = questions.map((question) => {
    const label = `${question.title} - ${question.id}`;
    const value = question.id;
    return { label, value };
  });

  const deleteEdgeEntry = (event: any, edgeIndex: number) => {
    event.preventDefault();

    setCurrEdges((edges) => {
      edges.splice(edgeIndex, 1);
      return [...edges];
    });
  };

  return (
    <Div position="relative">
      <Div useFlex my={10} flexDirection="column" backgroundColor="#f5f5f5">
        <DeleteCustomerButtonContainer onClick={(e) => deleteEdgeEntry(e, index)}><X /></DeleteCustomerButtonContainer>
        <StyledLabel marginTop={10} marginBottom={20}>Child node #{index + 1}</StyledLabel>
        <Select options={newSelect} value={currChildQuestion} onChange={(childNode) => setChildQuestion(childNode)} />
        <Div mt={10} mb={20}>
          <StyledLabel>conditionType</StyledLabel>
          {
            // TODO: Clear fields when condition type is changed?
          }
          <Select options={conditionTypes} value={currCondition} onChange={(qOption) => setCondition(qOption)} />
          {
            currCondition.value === 'valueBoundary' && (
              <Div mt={10}>
                <StyledLabel ml={5} mr={5}>Min value</StyledLabel>
                <StyledInput defaultValue={edge?.conditions?.[0].renderMin} onBlur={(event: React.FocusEvent<HTMLInputElement>) => setMinValue(event)} />
                <StyledLabel ml={5} mr={5}>Max value</StyledLabel>
                <StyledInput defaultValue={edge?.conditions?.[0].renderMax} onBlur={(event: React.FocusEvent<HTMLInputElement>) => setMaxValue(event)} />
              </Div>
            )
          }
          {
            currCondition.value === 'match' && (
              <Div mt={10}>
                <StyledLabel ml={5} mr={5}>Match value</StyledLabel>
                <StyledInput defaultValue={edge?.conditions?.[0].matchValue} onBlur={(event: React.FocusEvent<HTMLInputElement>) => setEdgeConditionMatchValue(event.target.value, index)} />
              </Div>
            )
          }
        </Div>
      </Div>
    </Div>
  );
};

const QuestionEntryView = styled.div`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;


const questionTypes = [{ value: 'SLIDER', label: 'SLIDER' }, { value: 'MULTI_CHOICE', label: 'MULTI_CHOICE' }];

const QuestionEntry = ({ questionsQ, question, leafs, index, setNewTitle, onIsRootQuestionChange, onLeafNodeChange, onQuestionTypeChange, onQuestionOptionsChange, onAddQuestionOption, onEdgesChange }: { questionsQ: Array<QuestionEntryProps>, question: QuestionEntryProps, leafs: any, index: number, setNewTitle: Function, onLeafNodeChange: Function, onQuestionTypeChange: Function, onQuestionOptionsChange: Function, onAddQuestionOption: Function, onEdgesChange: Function, onIsRootQuestionChange: Function }) => {
  const { register, handleSubmit, errors } = useForm();

  const [currLeaf, setCurrLeaf] = useState({ label: question.overrideLeaf?.title, value: question.overrideLeaf?.id });
  const [currQuestionType, setCurrQuestionType] = useState({ label: question.questionType, value: question.questionType });
  const [currOptions, setCurrOptions] = useState(question?.options || []);
  const [currEdges, setCurrEdges] = useState(question?.edgeChildren || []);
  const [isRoot, setIsRoot] = useState(question?.isRoot);
  const isIntialRender = useRef(true);

  const setQuestionType = (questionType: any) => {
    const { label, value } = questionType;
    setCurrQuestionType({ label, value });
    onQuestionTypeChange(value, index);
  };

  const setLeafNode = (leafNode: any) => {
    const { label, value } = leafNode;
    setCurrLeaf({ label, value });
    // TODO: Set new leaf
    onLeafNodeChange(value, index);
  };

  const setIsRootQuestion = () => {
    onIsRootQuestionChange(!isRoot, index);
    setIsRoot(!isRoot);
  };

  const addNewOption = (event: any, qIndex: number) => {
    event.preventDefault();

    const value = '';
    const publicValue = '';

    setCurrOptions((options) => [...options, { value, publicValue }]);
    onAddQuestionOption(currOptions, qIndex);
  };

  const setConditionType = (conditionType: string, edgeIndex: number) => {
    setCurrEdges((edgesPrev: Array<EdgeChildProps>) => {
      const edge: EdgeChildProps = edgesPrev[edgeIndex];
      if (edge.conditions.length === 0) {
        edge.conditions = [{ conditionType }];
        return [...edgesPrev];
      }

      edge.conditions[0].conditionType = conditionType;
      return [...edgesPrev];
    });
  };

  const setChildQuestionNode = (childNode: any, edgeIndex: number) => {
    setCurrEdges((edgesPrev: Array<EdgeChildProps>) => {
      let edge: EdgeChildProps = edgesPrev[edgeIndex];
      if (!edge) {
        edge = { childNode, conditions: [], parentNode: {} };
        return [...edgesPrev];
      }

      edge.childNode = childNode;
      return [...edgesPrev];
    });
  };

  const setEdgeConditionMinValue = (renderMin: number, edgeIndex: number) => {
    setCurrEdges((edgesPrev: Array<EdgeChildProps>) => {
      const edge: EdgeChildProps = edgesPrev[edgeIndex];
      if (edge?.conditions?.length === 0) {
        edge.conditions = [{ renderMin }];
        return [...edgesPrev];
      }

      edge.conditions[0].renderMin = renderMin;
      return [...edgesPrev];
    });
  };

  const setEdgeConditionMaxValue = (renderMax: number, edgeIndex: number) => {
    setCurrEdges((edgesPrev: Array<EdgeChildProps>) => {
      const edge: EdgeChildProps = edgesPrev[edgeIndex];
      if (edge?.conditions?.length === 0) {
        edge.conditions = [{ renderMax }];
        return [...edgesPrev];
      }

      edge.conditions[0].renderMax = renderMax;
      return [...edgesPrev];
    });
  };

  const setEdgeConditionMatchValue = (matchValue: string, edgeIndex: number) => {
    setCurrEdges((edgesPrev: Array<EdgeChildProps>) => {
      const edge: EdgeChildProps = edgesPrev[edgeIndex];
      if (edge?.conditions?.length === 0) {
        edge.conditions = [{ matchValue }];
        return [...edgesPrev];
      }

      edge.conditions[0].matchValue = matchValue;
      return [...edgesPrev];
    });
  };

  useEffect(() => {
    if (isIntialRender.current === true) {
      isIntialRender.current = false;
      return;
    }

    onEdgesChange(currEdges, index);
  }, [currEdges, isIntialRender]);

  const addNewEdge = (event: any) => {
    event.preventDefault();
    setCurrEdges((edges: Array<EdgeChildProps>) => [...edges, {
      id: undefined,
      conditions: [],
      parentNode: { id: question.id, title: question.title },
      childNode: {},
    }]);
  };

  const deleteOption = (event: any, questionIndex: number, optionIndex: number) => {
    event.preventDefault();
    setCurrOptions((options) => {
      options.splice(optionIndex, 1);
      return [...options];
    });
    onQuestionOptionsChange(currOptions, questionIndex);
  };

  const setOption = (event: any, questionIndex: number, optionIndex: number) => {
    event.preventDefault();
    const { value } = event.target;
    setCurrOptions((options) => {
      options[optionIndex] = { value, publicValue: '' };
      return [...options];
    });

    onQuestionOptionsChange(currOptions, questionIndex);
  };

  return (
    <QuestionEntryView>
      <Div backgroundColor="#daecfc" margin={5} py={6}>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <H4>Question: {question.id}</H4>
          <StyledLabel>Title</StyledLabel>
          <StyledInput name="title" defaultValue={question.title} onBlur={(e) => setNewTitle(e, index)} ref={register({ required: true })} />
          {errors.title && <Muted color="warning">Something went wrong!</Muted>}
        </Div>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="row">
          <StyledLabel>Is root:</StyledLabel>
          <input
            name="isGoing"
            type="checkbox"
            checked={question.isRoot}
            onChange={() => setIsRootQuestion()}
          />
        </Div>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <StyledLabel>Question type</StyledLabel>
          <Select options={questionTypes} value={currQuestionType} onChange={(qOption) => setQuestionType(qOption)} />
        </Div>
        {currQuestionType.value === 'MULTI_CHOICE' && (
          <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
            <H4>OPTIONS</H4>
            {
              ((currOptions && currOptions.length === 0) || (!currOptions)) && (
                <Div alignSelf="center">
                  No options available...
                </Div>
              )
            }
            {
              currOptions && currOptions.map((option, optionIndex) => {
                return (
                  <Div key={`${optionIndex}-${option.value}`} my={1} useFlex flexDirection="row">
                    <StyledInput key={optionIndex} name={`${question.id}-option-${optionIndex}`} defaultValue={option.value} onBlur={(e) => setOption(e, index, optionIndex)} />
                    <DeleteQuestionOptionButtonContainer onClick={(e) => deleteOption(e, index, optionIndex)}> <MinusCircle /> </DeleteQuestionOptionButtonContainer>
                  </Div>
                );
              })
            }
            <Hr />
            <Button brand="default" mt={2} ml={4} mr={4} onClick={(e) => addNewOption(e, index)}>Add new option</Button>
          </Div>
        )}
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <StyledLabel>Leaf node</StyledLabel>
          <Select options={leafs} value={(currLeaf?.value && currLeaf) || leafs[0]} onChange={(leafOption) => setLeafNode(leafOption)} />
        </Div>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <H4>Edges</H4>
          {
            ((currEdges && currEdges.length === 0) || (!currEdges)) && (
              <Div alignSelf="center">
                No edges available...
              </Div>
            )
          }
          {
            currEdges && currEdges.map((edge: EdgeChildProps, edgeIndex: number) => {
              return <EdgeEntry setEdgeConditionMatchValue={setEdgeConditionMatchValue} setEdgeConditionMaxValue={setEdgeConditionMaxValue} setEdgeConditionMinValue={setEdgeConditionMinValue} setChildQuestionNode={setChildQuestionNode} setConditionType={setConditionType} onEdgesChange={onEdgesChange} key={`${edgeIndex}-${edge.id}`} setCurrEdges={setCurrEdges} questions={questionsQ} edge={edge} index={edgeIndex} />;
            })
          }
          <Button brand="default" mt={2} ml={4} mr={4} onClick={(e) => addNewEdge(e)}>Add new edge</Button>
        </Div>
      </Div>
    </QuestionEntryView>
  );
};



const StyledLabel = styled(Div).attrs({ as: 'label' })`
  ${({ theme }) => css`
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 2px;
    display: inline-block;
    color: ${theme.colors.default.dark}
    text-transform: uppercase;
  `}
`;

const StyledInput = styled.input`
  ${({ theme }) => css`
    border-radius: ${theme.borderRadiuses.sm};
    background: ${theme.colors.white};
    border: none;
    border-bottom: ${theme.colors.default.normal} 1px solid;
    box-shadow: none;
    background: white;
    border-radius: 3px;

    /* Make somehow a color */
    border: 1px solid #dbdde0;
    box-shadow: none;

    /* Set to variable */
    padding: 15px;
  `}
`;

const StyledTextInput = styled(StyledInput).attrs({ as: 'textarea' })`
  resize: none;
  min-height: 150px;
`;

const TopicBuilderContentView = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
`;

interface LeafProps {
  id: string;
  type: string;
  title: string;
}

const TopicBuilderContent = () => {
  const { topicId } = useParams();
  const { loading, data } = useQuery(getTopicBuilderQuery, {
    variables: { topicId },
  });

  const [questions, setQuestions] = useState(data?.questionnaire?.questions || []);

  useEffect(() => {
    if (data?.questionnaire) {
      setQuestions(data?.questionnaire.questions);
    }
  }, [data]);

  if (loading) {
    return <Loader />;
  }
  console.log('Current questions: ', questions);
  const topicBuilderData = data?.questionnaire;
  const leafs: Array<LeafProps> = topicBuilderData?.leafs;

  const selectLeafs = leafs.map((leaf) => {
    return { value: leaf.id, label: leaf.title };
  });

  selectLeafs.unshift({ value: 'None', label: 'None' });

  const setNewTitle = (event: any, qIndex: number) => {
    event.preventDefault();
    setQuestions((questionsPrev: Array<QuestionEntryProps>) => {
      questionsPrev[qIndex].title = event.target.value;
      return [...questionsPrev];
    });
  };

  const onIsRootQuestionChange = (isRoot: boolean, qIndex: number) => {
    console.log('is root?: ', isRoot);
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
      <TopicBuilderContentView>
        {
          (questions && questions.length === 0) && (
            <Div alignSelf="center">No question available...</Div>
          )
        }
        {
          questions && questions.map((question: QuestionEntryProps, index: number) => {
            return <QuestionEntry onIsRootQuestionChange={onIsRootQuestionChange} onLeafNodeChange={onLeafNodeChange} onEdgesChange={onEdgesChange} onAddQuestionOption={onAddQuestionOption} onQuestionOptionsChange={onQuestionOptionsChange} onQuestionTypeChange={onQuestionTypeChange} setNewTitle={setNewTitle} key={index} index={index} questionsQ={questions} question={question} leafs={selectLeafs} />;
          })
        }
        <Button brand="default" mt={2} ml={4} mr={4} onClick={(e) => onAddQuestion(e)}>Add new question</Button>
        <Button brand="primary" mt={2} ml={4} mr={4} type="submit">Save submit</Button>
      </TopicBuilderContentView>
    </>
  );
};

const TopicAnswerFlowView = styled.div`
  margin-top: 10px;
`;

const TopicAnswerFlow = ({ sessionId }: { sessionId: string }) => {
  const { loading, data } = useQuery(getSessionAnswerFlow, {
    variables: { sessionId },
  });

  if (loading) return <Loader />;

  const session = data?.session;

  return (
    <TopicAnswerFlowView>
      <H2 color="default.text" fontWeight={400} mb={4}>
        {session ? `Answer flow - ${sessionId}` : 'Answer flow'}
      </H2>
      {
        !session && (
          <>
            <div>No session selected...</div>
          </>
        )
      }
      {
        session && (
          <>
            {
              session && session?.nodeEntries.map((nodeEntry: NodeEntryProps, index: number) => <TopicAnswerEntry key={index} nodeEntry={nodeEntry} />)
            }
          </>
        )
      }
    </TopicAnswerFlowView>
  );
};

const TopicAnswerEntry = ({ nodeEntry }: { nodeEntry: NodeEntryProps }) => (
  <TopicAnswerEntryView>
    <div>
      Question: {nodeEntry.relatedNode.title}
    </div>
    <div>
      <strong>
        Answer: {nodeEntry.values?.[0].numberValue
          ? nodeEntry.values?.[0].numberValue
          : nodeEntry.values?.[0].textValue}
      </strong>
    </div>
    <Hr />
  </TopicAnswerEntryView>
);

const TopicAnswerEntryView = styled.div`
  margin: 10px;
`;

const getUniversalDate = (date: Date) => {
  const result = `${date.getDate().toString()}-${monthMap.get(date.getMonth())}-${date.getFullYear().toString()}`;
  return result;
};

const TimelineEntry = ({
  setCurrSession,
  timeLineEntry,
}: {
  setCurrSession: Dispatch<SetStateAction<string>>,
  timeLineEntry: TimelineEntryProps
}) => {
  const date = new Date(timeLineEntry.createdAt);
  const acceptedDate = getUniversalDate(date);
  const history = useHistory();
  const { customerId, topicId } = useParams();

  // TODO: Set setCurrSession on a context, so you dont pass it as prop around
  const viewTimeLine = () => {
    history.push(`/c/${customerId}/t/${topicId}/e/${timeLineEntry.sessionId}`);
    setCurrSession(timeLineEntry.sessionId);
  };

  return (
    <TimeLineEntryContainer onClick={() => viewTimeLine()}>
      <Div>
        <Div>
          User {timeLineEntry.sessionId} has voted {timeLineEntry.value}
        </Div>
      </Div>

      <Div>
        <H5>
          {acceptedDate}
        </H5>
      </Div>
    </TimeLineEntryContainer>
  );
};

const HistoryLog = ({ setCurrSession, timelineEntries }: { setCurrSession: Dispatch<SetStateAction<string>>, timelineEntries: Array<TimelineEntryProps> }) => (
  <HistoryLogContainer>
    <Div useFlex alignItems="center" mb={4}>
      <H2 color="primary" fontWeight={400}>
        Timeline feed
      </H2>
    </Div>
    <Muted>
      History of entries for this topic
    </Muted>
    <Hr />
    {timelineEntries?.length > 0 && timelineEntries?.map((timelineEntry, index) => (
      <TimelineEntry setCurrSession={setCurrSession} key={index} timeLineEntry={timelineEntry} />)
    )}
    {(timelineEntries?.length === 0 || (!timelineEntries)) && (
      <div style={{ margin: '5px 20px' }}>No data available...</div>
    )}
  </HistoryLogContainer>
);

const TimeLineEntryContainer = styled.div`
   ${({ theme }) => css`
    padding: 8px 14px;
    border-radius: ${theme.borderRadiuses.md};
    background: ${theme.colors.primaryAlt};
    color: ${theme.colors.primary};
    margin: ${theme.gutter}px 0;
    transition: all 0.2s ease-in;
    cursor: pointer;

    :hover {
      transition: all 0.2s ease-in;
      background: ${theme.colors.primary};
      color: white;
    }
  `}
`;

const TopicDetails = (
  { QuestionnaireDetailResult }: { QuestionnaireDetailResult: QuestionnaireDetailResult },
) => (
    <TopicDetailsView>
      {
        QuestionnaireDetailResult && (
          <>
            <H2 color="default.text" fontWeight={400} mb={4}>
              {QuestionnaireDetailResult?.customerName} - {QuestionnaireDetailResult?.title}
            </H2>
            <Muted>
              {QuestionnaireDetailResult?.description}
            </Muted>
            <Hr />
            <div style={{ marginTop: '10px' }}>
              Created at: {getUniversalDate(new Date(QuestionnaireDetailResult?.creationDate))}
            </div>
            <div>
              {
                QuestionnaireDetailResult?.average !== 'false' && (
                  <Score>
                    <div style={{ marginTop: '5px', alignSelf: 'centre' }}>
                      Average score:
                  </div>
                    <div style={{ marginLeft: '5px', fontSize: '200%', alignSelf: 'flex-start' }}>
                      {parseFloat(QuestionnaireDetailResult?.average).toPrecision(4)}/
                  </div>
                    <div style={{ alignSelf: 'flex-end', marginBottom: '2px' }}>
                      {QuestionnaireDetailResult?.totalNodeEntries} answer(s)
                  </div>
                  </Score>
                )
              }

            </div>
          </>
        )
      }
    </TopicDetailsView>
  );

const Score = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TopicDetailsView = styled.div`
  display: flex;
  align-self: flex-start;
  flex-direction: column;
`;

const HistoryLogContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    background: #daecfc;
    border-radius: 20px;
    padding: ${theme.gutter}px;
  `}
`;

const Hr = styled.hr`
  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.default.light};
  `}
`;

export default TopicView;
