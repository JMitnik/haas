import * as UI from '@haas/ui';
import { EyeOff } from 'react-feather';
import { motion } from 'framer-motion';
import React from 'react';
import theme from 'config/theme';
import useMeasure from 'react-use-measure';

import {
  GetWorkspaceSummaryDetails,
  useDeselectTopicMutation,
} from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';
import { useToast } from 'hooks/useToast';

import { ClickableSvg, Item } from './TopicRankingWidgetStyles';
import { ShowMoreButton } from './SVGShowMoreButton';

interface TopicRankingWidgetProps {
  totalResponseCount: number;
  topics: GetWorkspaceSummaryDetails.RankedTopics[];
}

export const TopicRankingWidget = ({ topics, totalResponseCount }: TopicRankingWidgetProps) => {
  const [ref, bounds] = useMeasure();
  const { activeCustomer } = useCustomer();
  const toast = useToast();

  const barHeight = 25;
  const margin = 4;

  const [deselectTopic] = useDeselectTopicMutation({
    refetchQueries: ['GetWorkspaceSummaryDetails'],
    onCompleted: () => {
      toast.success({
        title: 'Option hidden',
        description: 'Succesfully hid option from topics',
      });
    },
  });

  const handleDeselectTopic = (topic: string, onClosePopoverCallback: () => void) => {
    deselectTopic({
      variables: {
        input: {
          topic,
          workspaceId: activeCustomer?.id as string,
        },
      },
    });
    onClosePopoverCallback();
  };

  return (
    <UI.Card>
      <UI.CardBodyLarge>
        <UI.Helper>
          Top topics
        </UI.Helper>

        <UI.Div ref={ref} mt={2}>
          <ClickableSvg width={bounds.width} height={160}>
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
                  x={bounds.width - 190}
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
                <ShowMoreButton bounds={bounds} index={index} margin={margin}>
                  {(handleClose) => (
                    <UI.Card style={{ borderRadius: '10px' }} padding="0.5em" minWidth={200}>
                      <Item onClick={() => handleDeselectTopic(topic.name, handleClose)}>
                        <UI.Icon>
                          <EyeOff />
                        </UI.Icon>
                        Hide topic
                      </Item>
                    </UI.Card>
                  )}

                </ShowMoreButton>

              </React.Fragment>
            ))}
          </ClickableSvg>
        </UI.Div>
      </UI.CardBodyLarge>
    </UI.Card>
  );
};
