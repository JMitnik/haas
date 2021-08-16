import * as UI from '@haas/ui';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

import { DialogueStatisticsSessionsSummaryType } from 'types/generated-types';

import useLocalStorage from 'hooks/useLocalStorage';

const ScoreGraphModuleContainer = styled.div`
  ${({ theme }) => css`
    .tooltip {
      border-radius: 10px;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
      border-color: ${theme.colors.gray[200]} !important;
    }

    .recharts-cartesian-axis-tick-value {
      color: ${theme.colors.gray[500]};
      font-weight: 500;
      line-height: 1rem;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `}
`;

interface GraphDatum {
  name: string;
  count: number;
}

type Metric = 'count' | 'score';

const ScoreGraphModule = ({ chartData }: { chartData: DialogueStatisticsSessionsSummaryType[] }) => {
  const [metric, setMetric] = useLocalStorage<Metric>('dialogue:prefer_metric', 'count');
  const { t } = useTranslation();

  const historyData: GraphDatum[] = chartData.map((chartDatum) => ({
    name: format(new Date(chartDatum.startDate), 'MM/dd/yyyy'),
    count: chartDatum.count,
    score: (chartDatum.average / 10).toFixed(2),
  }));

  const domain = metric === 'count' ? ['dataMin', 'dataMax'] : [0, 10];

  return (
    <ScoreGraphModuleContainer>
      <UI.Card height={400} bg="white">
        <UI.CardHead bg="blue.50">
          <UI.Flex justifyContent="space-between" alignItems="center">
            <UI.Text color="blue.500">
              {t(`${metric}_heading`)}
            </UI.Text>

            <UI.Div>
              <UI.DropdownButton
                options={[
                  { value: 'score', label: t('score') },
                  { value: 'count', label: t('count') },
                ]}
                onClick={(clickedMetric) => setMetric(clickedMetric)}
              >
                {t(metric)}
              </UI.DropdownButton>
            </UI.Div>
          </UI.Flex>
        </UI.CardHead>
        <UI.CardBody>
          <UI.Flex alignItems="center" height="100%">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={historyData}
                margin={{ top: 24, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008ecf" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4DB0DD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis className="x-axis" dataKey="name" fontFamily="Inter" fontWeight={500} dy={12} />
                <YAxis domain={domain} className="y-axis" fontFamily="Inter" fontWeight={500} dx={-12} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip wrapperClassName="tooltip" />
                <Area
                  strokeWidth={3}
                  type="monotone"
                  dataKey={metric}
                  stroke="#4DB0DD"
                  fillOpacity={1}
                  fill="url(#colorPv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </UI.Flex>
        </UI.CardBody>
      </UI.Card>
    </ScoreGraphModuleContainer>
  );
};

export default ScoreGraphModule;
