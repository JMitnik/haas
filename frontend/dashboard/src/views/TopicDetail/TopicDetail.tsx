import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Flex, Loader, Grid, Div, H3, Button } from '@haas/ui';
import { useParams, Switch, Route, useHistory, useLocation } from 'react-router-dom';
import { ResponsiveLine } from '@nivo/line';
import getQuestionnaireData from '../../queries/getQuestionnaireData';
import TimelineFeedOverview from './TimelineFeedOverview/TimelineFeedOverview';
import NodeEntriesOverview from './NodeEntriesOverview/NodeEntriesOverview';
import TopicBuilder from './TopicBuilder/TopicBuilder';
import TopicInfo from './TopicInfo/TopicInfo';
import Modal from 'components/Modal';
import styled, { css } from 'styled-components/macro';

const filterMap = new Map([
  ['Today', 0],
  ['Last week', 7],
  ['Last month', 30],
  ['Last year', 365],
]);

const MyResponsiveLine = ({ data }: { data: any }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 150, bottom: 100, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false,
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={null
      // {
      //   orient: 'bottom',
      //   tickSize: 5,
      //   tickPadding: 5,
      //   tickRotation: 45,
      //   // legend: 'transportation',
      //   legendOffset: 36,
      //   legendPosition: 'middle',
      // }
    }
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'dialogue score',
      legendOffset: -40,
      legendPosition: 'middle',
    }}
    colors={{ scheme: 'nivo' }}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabel="y"
    pointLabelYOffset={-12}
    useMesh
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: 'left-to-right',
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: 'circle',
        symbolBorderColor: 'rgba(0, 0, 0, .5)',
        effects: [
          {
            on: 'hover',
            style: {
              itemBackground: 'rgba(0, 0, 0, .03)',
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

const FilterButton = styled(Div)`
  ${({ theme, isActive }: { theme: any, isActive: boolean }) => css`
  
  ${isActive && css`
      background: ${theme.colors.primary};
    `}  
  ${!isActive && css`&:hover {
        background: ${theme.colors.default.normal};
      }`
    }
  `}
  border-radius: 12px;
  padding: 10px;
  margin: 5px;
  cursor: pointer;
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

const TopicDetail = () => {
  const { customerId, topicId } = useParams();
  const [activeSession, setActiveSession] = useState('');
  const location = useLocation<any>();
  const [activeFilter, setActiveFilter] = useState('Last month');
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
  const lineData = [
    {
      id: 'avg score on date',
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
                      <Div display='flex'>
                        {/* backgroundColor={activeFilter === 'Today' ? 'purple' : '#f7f9fe'} */}
                        <FilterButton isActive={activeFilter === 'Today'} onClick={(e) => setActiveFilter('Today')}>Today</FilterButton>
                        <FilterButton isActive={activeFilter === 'Last week'} onClick={(e) => setActiveFilter('Last week')}>Last week</FilterButton>
                        <FilterButton isActive={activeFilter === 'Last month'} onClick={(e) => setActiveFilter('Last month')}>Last month</FilterButton>
                        <FilterButton isActive={activeFilter === 'Last year'} onClick={(e) => setActiveFilter('Last year')}>Last year</FilterButton>
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
                    timelineEntries={resultData?.timelineEntries}
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

export default TopicDetail;
