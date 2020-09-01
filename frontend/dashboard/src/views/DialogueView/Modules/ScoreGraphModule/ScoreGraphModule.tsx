import { Card, CardBody, Flex, H3, Span, Text } from '@haas/ui';
import { ResponsiveLine as NivoLineChart } from '@nivo/line';
import {
  dialogueStatistics_customer_dialogue_statistics_history as SessionHistory,
} from 'views/DialogueView/__generated__/dialogueStatistics';
import React from 'react';

const ScoreGraphModule = ({ chartData }: { chartData: SessionHistory[] }) => {
  // TODO: Return a nice null card or something
  if (!chartData) {
    return null;
  }

  const data = [
    {
      id: 'score',
      color: 'hsl(38, 70%, 50%)',
      data: chartData,
    },
  ];

  return (
    <Card height="400px" bg="white">
      <CardBody height="100%">
        <Text fontSize="1.2rem" color="gray.400">
          <Flex justifyContent="space-between" alignItems="center">
            <Span>Score over time</Span>
          </Flex>
        </Text>
        <NivoLineChart
          data={data}
          margin={{ top: 50, right: 30, bottom: 70, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear', min: 0, max: 100, stacked: true, reverse: false,
          }}
          lineWidth={2}
          axisTop={null}
          axisRight={null}
          enableArea
          axisBottom={null}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'dialogue score',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          colors={{ scheme: 'category10' }}
          pointSize={10}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          curve="natural"
          pointLabelYOffset={-12}
          useMesh
        />
      </CardBody>
    </Card>
  );
};

export default ScoreGraphModule;
