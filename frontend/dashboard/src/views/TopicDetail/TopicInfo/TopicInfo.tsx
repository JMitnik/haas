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

const monthMap = new Map([
  [0, 'JAN'],
  [1, 'FEB'],
  [2, 'MAR'],
  [3, 'APR'],
  [4, 'MAY'],
  [5, 'JUN'],
  [6, 'JUL'],
  [7, 'AUG'],
  [8, 'SEP'],
  [9, 'OCT'],
  [10, 'NOV'],
  [11, 'DEC'],
]);

const getUniversalDate = (date: Date) => {
  const result = `${date.getDate().toString()}-${monthMap.get(date.getMonth())}-${date.getFullYear().toString()}`;
  return result;
};

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
          <div style={{ marginTop: '10px' }}>
            `Created at:

            `
            {getUniversalDate(new Date(DialogueResultProps?.creationDate))}
          </div>
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
