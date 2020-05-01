import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Flex, Loader, Grid, Div } from '@haas/ui';
import { useParams, Switch, Route, useHistory } from 'react-router-dom';
import { ResponsiveLine } from '@nivo/line';
import getQuestionnaireData from '../../queries/getQuestionnaireData';
import TimelineFeedOverview from './TimelineFeedOverview/TimelineFeedOverview';
import NodeEntriesOverview from './NodeEntriesOverview/NodeEntriesOverview';
import TopicBuilder from './TopicBuilder/TopicBuilder';
import TopicInfo from './TopicInfo/TopicInfo';

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

const TopicDetail = () => {
  const { customerId, topicId } = useParams();
  const [activeSession, setActiveSession] = useState('');
  const history = useHistory();
  const { loading, data } = useQuery(getQuestionnaireData, {
    variables: { dialogueId: topicId },
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
      <Div width="80%" margin="0 auto">
        <Grid gridTemplateColumns="3fr 1fr">
          <Div>
            <Flex
              height="100%"
              alignItems="center"
              justifyContent="space-between"
              flexDirection="column"
            >
              <Switch>
                <Route path="/c/:customerId/t/:topicId/e/:entryId">
                  <NodeEntriesOverview sessionId={activeSession} />
                </Route>
                <Route path="/c/:customerId/t/:topicId/topic-builder/">
                  <TopicBuilder />
                </Route>
                <Route>
                  <TopicInfo DialogueResultProps={resultData} />
                  <button type="button" onClick={() => history.push(`/c/${customerId}/t/${topicId}/topic-builder/`)}>Go to topic builder</button>
                </Route>
              </Switch>
              <Div height="300px" width="100%">
                {
                  lineQueryData && <MyResponsiveLine data={lineData} />
                }
              </Div>
              <Div>
                <ol>
                  {
                  resultData?.topPositivePath.map(({ answer, quantity }: {answer: string, quantity: number}) => <li>{`${answer} (${quantity} answer(s))`}</li>
                  )
                }
                </ol>
              </Div>
              <Div>
                <ol>
                  {
                  resultData?.topNegativePath.map(({ answer, quantity }: {answer: string, quantity: number}) => <li>{`${answer} (${quantity} answer(s))`}</li>
                  )
                }
                </ol>
              </Div>
            </Flex>
          </Div>
          <Div>
            <TimelineFeedOverview
              onActiveSessionChange={setActiveSession}
              timelineEntries={resultData?.timelineEntries}
            />
          </Div>
        </Grid>
      </Div>
    </>
  );
};

export default TopicDetail;
