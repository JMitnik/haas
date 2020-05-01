import React from 'react';
import { H2, Muted, Hr, Div } from '@haas/ui';
import { TopicInfoView, Score } from './TopicInfoStyles';
import styled from 'styled-components/macro';

interface TimelineEntryProps {
  sessionId: string;
  value: number;
  createdAt: string;
}

interface DialogueResultProps {
  customerName: string;
  title: string;
  description: string;
  creationDate: string;
  updatedAt: string;
  average: string;
  totalNodeEntries: number;
  timelineEntries?: Array<TimelineEntryProps>
}

const StatisticWidget = styled(Div)`
  background: #f7f9fe;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 24px;

  ol {
    padding: 12px 24px;
  }
`;

const TopicInfo = (
  { DialogueResultProps, customerId, topicId }: { DialogueResultProps: DialogueResultProps, customerId: string, topicId: string },
) => {


  return (
<TopicInfoView>
    {
      DialogueResultProps && (
        <>
          <H2 color="#3e3d5a" fontWeight={400} mb={4}>
            {DialogueResultProps?.title}
          </H2>
          <StatisticWidget>
            {
              DialogueResultProps?.average !== 'false' && (
                <Score>
                  <div style={{ marginTop: '5px', alignSelf: 'centre' }}>
                    Average score:
                  </div>
                  <div style={{ marginLeft: '5px', fontSize: '200%', alignSelf: 'flex-start' }}>
                    {parseFloat(DialogueResultProps?.average).toPrecision(4)}
                  </div>
                </Score>
              )
            }
          </StatisticWidget>
        </>
      )
    }
  </TopicInfoView>
  );
};

export default TopicInfo;
