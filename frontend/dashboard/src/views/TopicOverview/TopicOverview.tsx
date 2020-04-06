/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Flex, Loader, Grid, Div } from '@haas/ui';
import { useParams, Switch, Route, useHistory } from 'react-router-dom';
import getQuestionnaireData from '../../queries/getQuestionnaireData';
import TimelineFeedOverview from '../TimelineFeedOverview/TimelineFeedOverview';
import AnswerFlowOverview from '../AnswerFlowOverview/AnswerFlowOverview';
import TopicBuilder from './TopicBuilder/TopicBuilder';
import TopicDetail from './TopicDetail/TopicDetail';

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
                  <AnswerFlowOverview sessionId={currSession} />
                </Route>
                <Route path="/c/:customerId/t/:topicId/topic-builder/">
                  <TopicBuilder />
                </Route>
                <Route>
                  <TopicDetail QuestionnaireDetailResult={resultData} />
                  <button type="button" onClick={() => history.push(`/c/${customerId}/t/${topicId}/topic-builder/`)}>Go to topic builder</button>
                </Route>
              </Switch>
            </Flex>
          </Div>
          <Div>
            <TimelineFeedOverview
              setCurrSession={setCurrSession}
              timelineEntries={resultData?.timelineEntries}
            />
          </Div>
        </Grid>
      </Div>
    </>
  );
};

export default TopicView;
