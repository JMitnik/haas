import * as UI from '@haas/ui';
import React from 'react';

import { EventBars } from 'components/Analytics/Common/EventBars/EventBars';
import { ScoreBox } from 'components/ScoreBox';

import { Issue } from './SimpleIssueTable.types';
import { IssueActionLabels } from './IssueActionLabels';
import { sampleIssues } from './__data__/sample';

const columns = '40px 2fr 50px 2fr';
interface SimpleIssueTableProps {
  issues: Issue[];
}

export const SimpleIssueTable = ({ issues = sampleIssues }: SimpleIssueTableProps) => (
  <UI.Card border="1px solid" borderColor="off.100">
    <UI.Div bg="neutral.300" borderRadius="20px 20px 0 0" borderBottom="1px solid" borderColor="off.100">
      <UI.CardBody>
        <UI.Grid gridTemplateColumns={columns}>
          <UI.Div />
          <UI.Helper>
            Issue
          </UI.Helper>
          <UI.Helper>
            Votes
          </UI.Helper>
        </UI.Grid>
      </UI.CardBody>
    </UI.Div>

    <UI.Div>
      <UI.CardBody>
        {issues.map((issue, index) => (
          <UI.Grid
            key={index}
            pt={index > 0 ? 2 : 0}
            borderTop={index > 0 ? '1px solid' : '0'}
            borderColor="off.100"
            pb={2}
            gridTemplateColumns={columns}
          >
            <UI.Flex alignItems="center">
              <UI.Div>
                <ScoreBox score={issue.score} />
              </UI.Div>
            </UI.Flex>
            <UI.Div>
              <UI.Div>
                <UI.Span fontSize="1rem" fontWeight={600} color="off.500">
                  {issue.topic}
                </UI.Span>
              </UI.Div>
              <UI.Div>
                <UI.Span color="off.500" fontSize="0.8rem">
                  in
                  {' '}
                  {issue.dialogueName}
                </UI.Span>
              </UI.Div>
              {!!issue.action && (
                <UI.Div mt={1}>
                  <IssueActionLabels issue={issue} />
                </UI.Div>
              )}
            </UI.Div>
            <UI.Flex mr={2} alignItems="center" color="off.500">
              <UI.Span fontSize="1rem" fontWeight={500}>
                {issue.voteCount}
              </UI.Span>
            </UI.Flex>
            <UI.Flex>

              <UI.Flex alignItems="center">
                <UI.Div>
                  <EventBars
                    width={200}
                    height={40}
                    events={issue.events}
                  />
                </UI.Div>
              </UI.Flex>
            </UI.Flex>
          </UI.Grid>
        ))}
      </UI.CardBody>
    </UI.Div>
  </UI.Card>
);
