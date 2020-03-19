/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, Dispatch, SetStateAction } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { H2, Flex, Muted, Loader, Grid, Div, H5, H4, H3, Button } from '@haas/ui';
import styled, { css } from 'styled-components';
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
  id: string;
  type?: string;
  title: string;
}
interface QuestionEntryProps {
  id: string;
  title: string;
  questionType: string;
  overrideLeaf?: OverrideLeafProps;
  edgeChildren?: Array<EdgeChildProps>
  options?: Array<string>
}

interface EdgeChildProps {
  id: string;
  conditions: Array<EdgeConditonProps>;
  parentNode: QuestionEntryProps;
  childNode: QuestionEntryProps;
}

interface EdgeConditonProps {
  id: string;
  conditionType: string;
  renderMin?: number;
  renderMax?: number;
  matchValue?: string;
}

const EdgeEntry = ({ edge, index } : {edge: EdgeChildProps, index: number}) => {
  return (
    <>
      <Div useFlex flexDirection="column">
        <StyledLabel>Child node #{index + 1}</StyledLabel>
        <StyledInput name="title" value={edge.childNode.title} />
      </Div>
    </>
  );
};

const QuestionEntryView = styled.div`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;


const questionTypes = [{ value: 'SLIDER', label: 'SLIDER' }, { value: 'MULTI-CHOICE', label: 'MULTI-CHOICE' }];

const QuestionEntry = ({ question, leafs }: { question: QuestionEntryProps, leafs: any }) => {
  const { register, handleSubmit, errors } = useForm();
  console.log('Question: ', question);

  const qType = { label: question.questionType, value: question.questionType };
  const currLeaf = { label: question.overrideLeaf?.title, value: question.overrideLeaf?.id };
  return (
    <QuestionEntryView>
      <Div backgroundColor="#daecfc" margin={5} py={6}>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <H4>Question: {question.id}</H4>
          <StyledLabel>Title</StyledLabel>
          <StyledInput name="title" value={question.title} ref={register({ required: true })} />
          {errors.title && <Muted color="warning">Something went wrong!</Muted>}
        </Div>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <StyledLabel>Question type</StyledLabel>
          <Select options={questionTypes} value={qType} />
        </Div>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <StyledLabel>Leaf node</StyledLabel>
          <Select options={leafs} value={currLeaf} />
        </Div>
        <Div useFlex pl={4} pr={4} pb={2} flexDirection="column">
          <H5>Child nodes</H5>
          {
            question.edgeChildren && question.edgeChildren.map((edge: EdgeChildProps, index) => {
              return <EdgeEntry edge={edge} index={index} />;
            })
          }
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
  console.log('topic Id: ', topicId);
  const { loading, data } = useQuery(getTopicBuilderQuery, {
    variables: { topicId },
  });

  if (loading) {
    return <Loader />;
  }

  const topicBuilderData = data?.questionnaire;
  console.log('Topic builder data: ', topicBuilderData);
  const leafs: Array<LeafProps> = topicBuilderData?.leafs;
  const selectLeafs = leafs.map((leaf) => {
    return { value: leaf.id, label: leaf.title };
  });

  return (
    <>
      <H2 color="default.text" fontWeight={400} mb={4}>
        Topic builder
      </H2>
      <TopicBuilderContentView>
        {
          topicBuilderData?.questions.map((question: QuestionEntryProps) => {
            return <QuestionEntry question={question} leafs={selectLeafs} />;
          })
        }
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
