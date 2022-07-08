import * as UI from '@haas/ui';
import { AlertTriangle } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

import { EventBars } from 'components/Analytics/Common/EventBars/EventBars';
import { FilterEnabledLabel } from 'components/Analytics/WorkspaceGrid/FilterEnabledLabel';
import { Issue } from 'components/Analytics/WorkspaceGrid/WorkspaceGrid.types';
import { ReactComponent as NoDataIll } from 'assets/images/undraw_solution.svg';
import { ScoreBox } from 'components/ScoreBox';

import { IssueActionLabels } from './IssueActionLabels';

const columns = '50px 3fr 100px 200px';
interface SimpleIssueTableProps {
  inPreview: boolean;
  onResetFilter: () => void;
  isFilterEnabled: boolean;
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
  onOpenIssueModal?: () => void;
  isLoading?: boolean;
}

const CUTOFF = 3;

interface IssueBodyProps {
  isLast?: boolean;
}

const IssueBody = styled(UI.CardBody)<IssueBodyProps>`
  ${({ theme, isLast }) => css`
    transition: all ${theme.transitions.normal};
    background-color: white;

    ${isLast && css`
      border-radius: 0 0 ${theme.borderRadiuses.lg}px ${theme.borderRadiuses.lg}px;
    `}

    &:hover {
      cursor: pointer;
      transition: all ${theme.transitions.normal};
      background-color: ${theme.colors.neutral[500]};
    }
  `}
`;

export const SimpleIssueTable = ({
  issues,
  onIssueClick,
  onResetFilter,
  onOpenIssueModal,
  isFilterEnabled = false,
  isLoading,
  inPreview = true,
}: SimpleIssueTableProps) => {
  const shownIssues = inPreview ? issues.slice(0, CUTOFF) : issues;
  const { t } = useTranslation();

  return (
    <UI.Card border="1px solid" borderColor="off.100">
      <UI.CardHeader>
        <UI.Div
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <UI.Flex alignItems="center" justifyContent="space-between">
            <UI.H4
              pb={3}
              color="off.500"
              fontSize="1.2rem"
              fontWeight={600}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <UI.Icon mr={2}>
                <AlertTriangle />
              </UI.Icon>
              Negative teams
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
            Team
          </UI.Helper>
          <UI.Helper>
            Quantity
          </UI.Helper>
          <UI.Helper>
            Pulse
          </UI.Helper>
        </UI.Grid>
      </UI.CardHeader>

      {!isLoading && issues.length === 0 && (
        <UI.CardBody>
          <UI.IllustrationCard flatten svg={<NoDataIll height={200} />} text={t('dashboard_no_issues')} />
        </UI.CardBody>
      )}

      <UI.Div>
        {shownIssues.map((issue, index) => (
          <IssueBody
            key={index}
            borderBottom="1px solid"
            borderColor="off.100"
            isLast={index === shownIssues.length - 1}
            onClick={() => onIssueClick(issue)}
          >
            <UI.Grid
              key={index}
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
                      width={150}
                      height={40}
                    />
                  </UI.Div>
                </UI.Flex>
              </UI.Flex>
            </UI.Grid>
          </IssueBody>
        ))}

        {issues.length > CUTOFF && inPreview && onOpenIssueModal && (
          <UI.CardBody>
            <UI.Flex justifyContent="center">
              <UI.Button onClick={onOpenIssueModal} variant="outline" variantColor="red">
                Show more
              </UI.Button>
            </UI.Flex>
          </UI.CardBody>
        )}
      </UI.Div>
    </UI.Card>
  );
};
