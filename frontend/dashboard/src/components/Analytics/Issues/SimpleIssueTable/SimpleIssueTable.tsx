import * as UI from '@haas/ui';
import { AlertTriangle, Filter } from 'react-feather';
import React from 'react';

import { EventBars } from 'components/Analytics/Common/EventBars/EventBars';
import { ControlButton } from 'components/Analytics/WorkspaceGrid/WorkspaceGrid.styles';
import { Issue } from 'components/Analytics/WorkspaceGrid/WorkspaceGrid.types';
import { ScoreBox } from 'components/ScoreBox';

import { IssueActionLabels } from './IssueActionLabels';
import { FilterEnabledLabel } from 'components/Analytics/WorkspaceGrid/FilterEnabledLabel';

const columns = '50px 3fr 50px 150px 80px';
interface SimpleIssueTableProps {
  inPreview: boolean;
  onResetFilter: () => void;
  isFilterEnabled: boolean;
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
  onOpenIssueModal?: () => void;
}

const CUTOFF = 3;

export const SimpleIssueTable = ({ issues, onIssueClick, onResetFilter, onOpenIssueModal, isFilterEnabled = false, inPreview = true }: SimpleIssueTableProps) => {
  const shownIssues = inPreview ? issues.slice(0, CUTOFF) : issues;

  return (
    <UI.Card border="1px solid" borderColor="off.100">
      <UI.CardHeader>
        <UI.Div
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <UI.Flex alignItems="center" justifyContent="space-between">
            <UI.H4 pb={3} color="off.500" fontSize="1.2rem" fontWeight={600} style={{ display: 'flex', alignItems: 'center' }}>
              <UI.Icon mr={2}>
                <AlertTriangle />
              </UI.Icon>
              Issues
            </UI.H4>

            {isFilterEnabled && (
              <UI.Div pb={3}>
                <FilterEnabledLabel onResetFilter={onResetFilter} />
              </UI.Div>
            )}
          </UI.Flex>
        </UI.Div>
        <UI.Grid pt={3} gridTemplateColumns={columns}>
          <UI.Helper>
            Score
          </UI.Helper>
          <UI.Helper>
            Issue
          </UI.Helper>
          <UI.Helper>
            Votes
          </UI.Helper>
        </UI.Grid>
      </UI.CardHeader>

      <UI.Div>
        <UI.CardBody>
          {shownIssues.map((issue, index) => (
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
                  <ScoreBox score={issue.basicStats.average} />
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
                    {issue.dialogue?.title}
                  </UI.Span>
                </UI.Div>
                {!!issue.followUpAction && (
                  <UI.Div mt={1}>
                    <IssueActionLabels issue={issue} />
                  </UI.Div>
                )}
              </UI.Div>
              <UI.Flex mr={2} alignItems="center" color="off.500">
                <UI.Span fontSize="1rem" fontWeight={500}>
                  {issue.basicStats.responseCount}
                </UI.Span>
              </UI.Flex>
              <UI.Flex>

                <UI.Flex alignItems="center">
                  <UI.Div>
                    <EventBars
                      events={issue.history.items}
                      width={100}
                      height={40}
                    />
                  </UI.Div>
                </UI.Flex>
              </UI.Flex>

              <UI.Flex alignItems="center">
                <ControlButton
                  onClick={() => onIssueClick(issue)}
                >
                  <UI.Icon>
                    <Filter />
                  </UI.Icon>
                </ControlButton>
              </UI.Flex>
            </UI.Grid>
          ))}

          {issues.length > CUTOFF && inPreview && onOpenIssueModal && (
            <UI.Flex justifyContent="center" mt={2}>
              <UI.Button onClick={onOpenIssueModal} variant="outline" variantColor="red">
                Show more
              </UI.Button>
            </UI.Flex>
          )}
        </UI.CardBody>
      </UI.Div>
    </UI.Card>
  );
};
