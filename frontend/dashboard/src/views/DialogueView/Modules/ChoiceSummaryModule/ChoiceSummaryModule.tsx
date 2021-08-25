import * as UI from '@haas/ui';
import { Bar,
  BarChart,
  CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { groupBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

import { DialogueChoiceSummaryType } from 'types/generated-types';

interface ChoiceSummaryModuleProps {
  data: DialogueChoiceSummaryType[];
}

const STOP_WORDS = ['Ja', 'Nee', 'Yes', 'No'];

const ChoiceSummaryContainer = styled.div`
  .recharts-text.recharts-cartesian-axis-tick-value {
    font-weight: 600;
    line-height: 1rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .recharts-legend-item {
    font-weight: 600;
    line-height: 1rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;
export const ChoiceSummaryModule = ({ data }: ChoiceSummaryModuleProps) => {
  const { t } = useTranslation();
  const barData = data.filter((item) => !STOP_WORDS.includes(item.choiceValue));
  const groups = Object.entries(groupBy(barData, (d) => d.choiceValue));

  const barData2 = groups.map(([choiceValue, choiceSummaries]) => {
    const choiceSummary = choiceSummaries.reduce((result, current) => {
      if (current.averageValue > 50) {
        result.positive += current.count;
      } else {
        result.negative += current.count;
      }

      return result;
    }, { positive: 0, negative: 0 });

    return { name: choiceValue, ...choiceSummary };
  });

  return (
    <ChoiceSummaryContainer>
      <UI.Card bg="white">
        <UI.CardHead bg="green.50">
          <UI.Text color="green.500">
            {t('frequent_answers_heading')}
          </UI.Text>
        </UI.CardHead>
        <UI.CardBody height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              layout="vertical"
              height={400}
              data={barData2}
              margin={{
                top: 5,
                right: 30,
                left: 120,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <ReferenceLine x={50} stroke="#000" />
              <Bar dataKey="negative" fill="hsl(0, 91%, 71%)" />
              <Bar dataKey="positive" fill="hsl(156, 72%, 67%)" />
            </BarChart>
          </ResponsiveContainer>
        </UI.CardBody>
      </UI.Card>
    </ChoiceSummaryContainer>
  );
};
