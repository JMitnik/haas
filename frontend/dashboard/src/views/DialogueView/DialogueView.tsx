import { Div, Grid, H3, Loader } from '@haas/ui';
import { Route, Switch, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';

import Modal from 'components/Modal';

import NodeEntriesOverview from './NodeEntriesOverview/NodeEntriesOverview';
import TimelineFeedOverview from './TimelineFeedOverview/TimelineFeedOverview';
import TopicBuilder from './TopicBuilder/TopicBuilder';
import TopicInfo from './TopicInfo/TopicInfo';
import getQuestionnaireData from '../../queries/getQuestionnaireData';

const filterMap = new Map([
  ['Last 24h', 1],
  ['Last week', 7],
  ['Last month', 30],
  ['Last year', 365],
]);

const FilterButton = styled(Div)`
  ${({ theme, isActive }: { theme: any, isActive: boolean }) => css`
    border-radius: 12px;
    padding: 10px;
    margin: 5px;
    cursor: pointer;

    ${isActive && css`
      background: ${theme.colors.primary};
    `}

    ${!isActive && css`
      &:hover {
        background: ${theme.colors.default.normal};
      }
    `}
  `}
`;

const Widget = styled(Div)`
  border-radius: 12px;
  padding: 12px;
`;

const StatisticWidget = styled(Widget)`
  background: #f7f9fe;

  ol {
    padding: 12px 24px;
  }
`;

const DialogueView = () => {
  const { customerId, topicId } = useParams();
  const [activeSession, setActiveSession] = useState('');
  const location = useLocation<any>();

  // FIXME: If this is started with anything else start result is undefined :S
  const [activeFilter, setActiveFilter] = useState('Last 24h');

  // TODO: Move this to page level
  const { loading, data } = useQuery(getQuestionnaireData, {
    variables: {
      dialogueId: topicId,
      filter: filterMap.get(activeFilter),
    },
    pollInterval: 5000,
  });

  if (loading) return <Loader />;

  const resultData = data?.getQuestionnaireData;
  const lineQueryData = resultData?.lineChartData;
  let timelineEntries: Array<any> = resultData?.timelineEntries;
  timelineEntries = timelineEntries?.length > 8 ? timelineEntries.slice(0, 8) : timelineEntries;

  const lineData = [
    {
      id: 'score',
      color: 'hsl(38, 70%, 50%)',
      data: lineQueryData,
    },
  ];

  return (
    <>
      <Div px="24px" margin="0 auto">
        <Div height="100vh" maxHeight="100vh" overflow="hidden">
          <Switch>
            <Route path="/dashboard/c/:customerId/t/:topicId/topic-builder/">
              <TopicBuilder />
            </Route>
            <Route>
              <Grid gridTemplateColumns="3fr 1fr">
                <Div>
                  <TopicInfo DialogueResultProps={resultData} customerId={customerId} topicId={topicId} />
                  <Grid gridTemplateColumns="1fr 1fr" gridTemplateRows="1fr 100px 3fr">
                    <Widget gridColumn="span 2">
                      <H3>Filter</H3>
                      <Div display="flex">
                        <FilterButton isActive={activeFilter === 'Last 24h'} onClick={() => setActiveFilter('Last 24h')}>Last 24h</FilterButton>
                        <FilterButton isActive={activeFilter === 'Last week'} onClick={() => setActiveFilter('Last week')}>Last week</FilterButton>
                        <FilterButton isActive={activeFilter === 'Last month'} onClick={() => setActiveFilter('Last month')}>Last month</FilterButton>
                        <FilterButton isActive={activeFilter === 'Last year'} onClick={() => setActiveFilter('Last year')}>Last year</FilterButton>
                      </Div>
                    </Widget>
                    <StatisticWidget>
                      <H3>Top positive results</H3>
                      <ol>
                        {
                          resultData?.topPositivePath.map(({ answer, quantity }: { answer: string, quantity: number }) => <li key={`${answer}-${quantity}`}>{`${answer} (${quantity} answer(s))`}</li>
                          )
                        }
                      </ol>
                    </StatisticWidget>

                    <StatisticWidget>
                      <H3>Top negative results</H3>
                      <ol>
                        {
                          resultData?.topNegativePath.map(({ answer, quantity }: { answer: string, quantity: number }) => <li key={`${answer}-${quantity}`}>{`${answer} (${quantity} answer(s))`}</li>
                          )
                        }
                      </ol>
                    </StatisticWidget>

                    <StatisticWidget gridColumn="span 2" height="300px" width="100%">
                      {
                        lineQueryData && <MyResponsiveLine data={lineData} />
                      }
                    </StatisticWidget>

                  </Grid>
                </Div>

                <Div>
                  <TimelineFeedOverview
                    onActiveSessionChange={setActiveSession}
                    timelineEntries={timelineEntries}
                  />
                </Div>
              </Grid>
            </Route>
          </Switch>
        </Div>
        {location?.state?.modal && (
          <Modal>
            <NodeEntriesOverview sessionId={activeSession} />
          </Modal>
        )}
      </Div>
    </>
  );
};

export default DialogueView;
