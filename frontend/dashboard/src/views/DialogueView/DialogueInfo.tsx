import React from 'react';
import styled from 'styled-components';

import { Div } from '@haas/ui';

import { Score, TopicInfoView } from './DialogueInfoStyles';

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

// TODO: Translation!
const DialogueInfo = ({ DialogueResultProps }: { DialogueResultProps: DialogueResultProps }) => (
  <TopicInfoView>
    {DialogueResultProps && (
    <StatisticWidget>
      {DialogueResultProps?.average !== 'false' && (
      <Score>
        <div style={{ marginTop: '5px', alignSelf: 'centre' }}>
          Average score:
        </div>
        <div style={{ marginLeft: '5px', fontSize: '200%', alignSelf: 'flex-start' }}>
          {parseFloat(DialogueResultProps?.average).toPrecision(4)}
        </div>
      </Score>
      )}
    </StatisticWidget>
    )}
  </TopicInfoView>
);

export default DialogueInfo;
