import * as UI from '@haas/ui';
import { motion } from 'framer-motion';
import React from 'react';
import theme from 'config/theme';
import useMeasure from 'react-use-measure';

import { GetWorkspaceSummaryDetails } from 'types/generated-types';

interface TopicRankingWidgetProps {
  totalResponseCount: number;
  topics: GetWorkspaceSummaryDetails.RankedTopics[];
}

export const TopicRankingWidget = ({ topics, totalResponseCount }: TopicRankingWidgetProps) => {
  const [ref, bounds] = useMeasure();

  const barHeight = 25;
  const margin = 4;

  return (
    <UI.NewCard>
      <UI.CardBodyLarge>
        <UI.Helper>
          Top topics
        </UI.Helper>

        <UI.Div ref={ref} mt={2}>
          <svg width={bounds.width} height={160}>
            {topics.map((topic, index) => (
              <React.Fragment key={index}>
                <motion.rect
                  key={topic.name}
                  x={0}
                  y={index * (barHeight / 2 + margin)}
                  height={barHeight}
                  initial={{
                    width: '0%',
                    opacity: 0,
                  }}
                  animate={{
                    width: `${(topic.basicStats?.responseCount ?? 0 / totalResponseCount)}%`,
                    opacity: 1,
                  }}
                  rx={5}
                  fill={theme.colors.main[100]}
                />

                <motion.text
                  y={barHeight / 3.5 + index * (barHeight / 2 + margin)}
                  height={barHeight / 1.5}
                  dominantBaseline="middle"
                  x={bounds.width - 335}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  fill={theme.colors.main[800]}
                >
                  {topic.name}
                </motion.text>

                <motion.text
                  y={barHeight / 3.5 + index * (barHeight / 2 + margin)}
                  height={barHeight / 1.5}
                  dominantBaseline="middle"
                  x={bounds.width - 180}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  fill={theme.colors.off[600]}
                >
                  {topic.basicStats?.responseCount}
                </motion.text>

              </React.Fragment>
            ))}
          </svg>
        </UI.Div>
      </UI.CardBodyLarge>
    </UI.NewCard>
  );
};
