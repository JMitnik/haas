import React from 'react';
import { H2, Muted, Hr } from '@haas/ui';
import { TopicInfoView, Score } from './TopicInfoStyles';

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

const TopicInfo = (
  { DialogueResultProps }: { DialogueResultProps: DialogueResultProps },
) => (
  <TopicInfoView>
    {
      DialogueResultProps && (
        <>
          <H2 color="default.text" fontWeight={400} mb={4}>
            {DialogueResultProps?.customerName}
            `
            -
            `
            {DialogueResultProps?.title}
          </H2>
          <Muted>
            {DialogueResultProps?.description}
          </Muted>
          <Hr />
          <div>
            {
              DialogueResultProps?.average !== 'false' && (
                <Score>
                  <div style={{ marginTop: '5px', alignSelf: 'centre' }}>
                    Average score:
                  </div>
                  <div style={{ marginLeft: '5px', fontSize: '200%', alignSelf: 'flex-start' }}>
                    {parseFloat(DialogueResultProps?.average).toPrecision(4)}
                    /
                  </div>
                  <div style={{ alignSelf: 'flex-end', marginBottom: '2px' }}>
                    {DialogueResultProps?.totalNodeEntries}
                    `

                    answer(s)
                    `

                  </div>
                </Score>
              )
            }
          </div>
        </>
      )
    }
  </TopicInfoView>
);

export default TopicInfo;
