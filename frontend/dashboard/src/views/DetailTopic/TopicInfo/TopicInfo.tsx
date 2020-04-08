import React from 'react';
import { H2, Muted, Hr } from '@haas/ui';
import { TopicInfoView, Score } from './TopicInfoStyles';

interface TimelineEntryProps {
  sessionId: string;
  value: number;
  createdAt: string;
}

interface QuestionnaireDetailResult {
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
  { QuestionnaireDetailResult }: { QuestionnaireDetailResult: QuestionnaireDetailResult },
) => (
  <TopicInfoView>
    {
      QuestionnaireDetailResult && (
        <>
          <H2 color="default.text" fontWeight={400} mb={4}>
            {QuestionnaireDetailResult?.customerName}
            {' '}
            -
            {' '}
            {QuestionnaireDetailResult?.title}
          </H2>
          <Muted>
            {QuestionnaireDetailResult?.description}
          </Muted>
          <Hr />
          <div style={{ marginTop: '10px' }}>
            Created at:
            {' '}
            {getUniversalDate(new Date(QuestionnaireDetailResult?.creationDate))}
          </div>
          <div>
            {
              QuestionnaireDetailResult?.average !== 'false' && (
                <Score>
                  <div style={{ marginTop: '5px', alignSelf: 'centre' }}>
                    Average score:
                  </div>
                  <div style={{ marginLeft: '5px', fontSize: '200%', alignSelf: 'flex-start' }}>
                    {parseFloat(QuestionnaireDetailResult?.average).toPrecision(4)}
                    /
                  </div>
                  <div style={{ alignSelf: 'flex-end', marginBottom: '2px' }}>
                    {QuestionnaireDetailResult?.totalNodeEntries}
                    {' '}
                    answer(s)
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
