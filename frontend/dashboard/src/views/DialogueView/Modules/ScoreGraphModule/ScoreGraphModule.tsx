import * as UI from '@haas/ui';
import { ResponsiveLine as NivoLineChart } from '@nivo/line';
import {
  dialogueStatistics_customer_dialogue_statistics_history as SessionHistory,
} from 'views/DialogueView/__generated__/dialogueStatistics';
import { useTranslation } from 'react-i18next';
import React from 'react';

const ScoreGraphModule = ({ chartData }: { chartData: SessionHistory[] }) => {
  const { t } = useTranslation();

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
    <UI.Card height="400px" bg="white">
      <UI.CardBody height="100%">
        <UI.Span fontSize="1.2rem" color="gray.400">
          <UI.Flex justifyContent="space-between" alignItems="center">
            <UI.Span>{t('dialogue:score_over_time')}</UI.Span>
          </UI.Flex>
        </UI.Span>
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
          colors={['#3d57cc']}
          pointSize={10}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabel="y"
          curve="natural"
          pointLabelYOffset={-12}
          useMesh

        />
      </UI.CardBody>
    </UI.Card>
  );
};

export default ScoreGraphModule;
