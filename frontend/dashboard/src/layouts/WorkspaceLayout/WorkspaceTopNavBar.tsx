import * as UI from '@haas/ui';
import {
  GradientLightgreenGreen,
  GradientOrangeRed,
  GradientPinkRed,
  GradientSteelPurple,
  LinearGradient,
} from '@visx/gradient';
import { NavLink } from 'react-router-dom';
import { PatternCircles } from '@visx/pattern';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { DateFormat, useDate } from 'hooks/useDate';
import { ProgressCircle } from 'components/Analytics/WorkspaceGrid/SummaryPane/ProgressCircle';
import {
  getColorScoreBrandVariable,
  getHexagonSVGFill,
} from 'components/Analytics/WorkspaceGrid/WorkspaceGrid.helpers';
import { useCustomer } from 'providers/CustomerProvider';
import { useFormatter } from 'hooks/useFormatter';
import { useGetWorkspaceLayoutDetailsQuery } from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';

import { TopSubNavBarContainer } from './TopSubNavBar.styles';

export const WorkspaceTopNavBar = () => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();
  const { formatFractionToPercentage } = useFormatter();
  const { getNWeekAgo, format, getTomorrow } = useDate();

  const { dashboardPath, workspaceInteractionsPath, workspaceIssuesPath } = useNavigator();

  const { data } = useGetWorkspaceLayoutDetailsQuery({
    fetchPolicy: 'no-cache',
    variables: {
      workspaceId: activeCustomer?.id || '',
      healthInput: {
        startDateTime: format(getNWeekAgo(1), DateFormat.DayFormat),
        endDateTime: format(getTomorrow(), DateFormat.DayFormat),
      },
    },
  });

  const health = data?.customer?.statistics?.health;
  const score = health?.score;
  const total = health?.nrVotes || 0;
  const positive = total - (health?.negativeResponseCount || 0);

  return (
    <TopSubNavBarContainer>
      <UI.Container px={4} pt={4}>
        <UI.Flex>
          <UI.Div>
            <svg height={0}>
              <PatternCircles id="circles" height={6} width={6} stroke="black" strokeWidth={1} />
              <GradientOrangeRed id="dots-orange" />
              <GradientPinkRed id="dots-pink" />
              <GradientSteelPurple id="dots-gray" />
              <LinearGradient id="grays" from="#757F9A" to="#939bb1" />
              <GradientLightgreenGreen id="dots-green" />
            </svg>
            <UI.Flex>
              <UI.Div mr={4}>
                <ProgressCircle
                  percentage={score}
                  stroke={getHexagonSVGFill(score)}
                  backgroundStroke="rgba(0, 0, 0, 0.1)"
                  size={70}
                  radius={45}
                  strokeWidth={10}
                >
                  <UI.Text fontSize="1rem" fontWeight={700} color={getColorScoreBrandVariable(score, true)}>
                    {!!score && (
                      <>
                        {formatFractionToPercentage(score / 100)}
                      </>
                    )}
                  </UI.Text>
                </ProgressCircle>
              </UI.Div>
              <UI.Div>
                <UI.ViewTitle>
                  {activeCustomer?.name}
                </UI.ViewTitle>
                {total > 0 ? (
                  <UI.ViewSubTitle>
                    {positive}
                    {' '}
                    of
                    {' '}
                    {total}
                    {' '}
                    respondents are happy,
                    average score:
                    {' '}
                    {health?.average ? (health?.average / 10).toFixed(1) : 'N/A'}
                  </UI.ViewSubTitle>
                ) : (
                  <UI.ViewSubTitle>
                    No data available at the moment
                  </UI.ViewSubTitle>
                )}

              </UI.Div>
            </UI.Flex>

            <UI.Div pt={4}>
              <UI.Span>
                <NavLink exact to={dashboardPath}>
                  {t('overview')}
                </NavLink>
              </UI.Span>

              <UI.Span>
                <NavLink to={workspaceInteractionsPath}>
                  {t('interactions')}
                </NavLink>
              </UI.Span>

              <UI.Span>
                <NavLink to={workspaceIssuesPath}>
                  {t('issues')}
                </NavLink>
              </UI.Span>
            </UI.Div>
          </UI.Div>
        </UI.Flex>
      </UI.Container>
    </TopSubNavBarContainer>
  );
};
