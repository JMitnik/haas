import * as qs from 'qs';
import { Activity, Award, BarChart, MessageCircle,
  ThumbsDown, ThumbsUp, TrendingDown, TrendingUp } from 'react-feather';
import { Button, Tag, TagIcon, TagLabel } from '@chakra-ui/core';
import { Div, Flex, Grid, H4, Icon, Loader, PageTitle, Span, Text } from '@haas/ui';
import { sub } from 'date-fns';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import React, { useReducer } from 'react';
import gql from 'graphql-tag';
import styled, { css } from 'styled-components/macro';

import { ReactComponent as PathsIcon } from 'assets/icons/icon-launch.svg';
import { ReactComponent as TrendingIcon } from 'assets/icons/icon-trending-up.svg';
import { ReactComponent as TrophyIcon } from 'assets/icons/icon-trophy.svg';

import InteractionFeedModule from './Modules/InteractionFeedModule/InteractionFeedModule';
import NegativePathsModule from './Modules/NegativePathsModule/index.tsx';
import PositivePathsModule from './Modules/PositivePathsModule/PositivePathsModule';
import ScoreGraphModule from './Modules/ScoreGraphModule';
import SummaryModule from './Modules/SummaryModules/SummaryModule';

type ActiveDateType = 'last_hour' | 'last_day' | 'last_week' | 'last_month' | 'last_year';

interface ActiveDateState {
  dateLabel: ActiveDateType;
  startDate: Date;
  compareStatisticStartDate: Date;
}

const DialogueViewContainer = styled(Div)`
  ${() => css`
    ${H4} {
      font-size: 1.2rem;
    }
  `}
`;

interface ActiveDateAction {
  type: ActiveDateType;
}

const DatePickerExpanded = ({ activeLabel, dispatch }: { activeLabel: ActiveDateType, dispatch: React.Dispatch<ActiveDateAction> }) => {
  const { t } = useTranslation();
  return (
    <Div>
      <Div>
        <Button size="sm" isActive={activeLabel === 'last_hour'} onClick={() => dispatch({ type: 'last_hour' })}>{t('dialogue:last_hour')}</Button>
        <Button
          ml={1}
          size="sm"
          isActive={activeLabel === 'last_day'}
          onClick={() => dispatch({ type: 'last_day' })}
        >
          {t('dialogue:last_day')}

        </Button>
        <Button
          ml={1}
          size="sm"
          isActive={activeLabel === 'last_week'}
          onClick={() => dispatch({ type: 'last_week' })}
        >
          {t('dialogue:last_week')}

        </Button>
        <Button
          size="sm"
          ml={1}
          isActive={activeLabel === 'last_month'}
          onClick={() => dispatch({ type: 'last_month' })}
        >
          {t('dialogue:last_month')}

        </Button>
      </Div>
    </Div>
  );
};

const dateReducer = (state: ActiveDateState, action: ActiveDateAction): ActiveDateState => {
  switch (action.type) {
    case 'last_hour':
      return {
        startDate: sub(new Date(), { hours: 1 }),
        compareStatisticStartDate: sub(new Date(), { hours: 2 }),
        dateLabel: 'last_hour',
      };

    case 'last_day':
      return {
        startDate: sub(new Date(), { hours: 24 }),
        compareStatisticStartDate: sub(new Date(), { days: 2 }),
        dateLabel: 'last_day',
      };
    case 'last_month':
      return {
        startDate: sub(new Date(), { months: 1 }),
        compareStatisticStartDate: sub(new Date(), { months: 2 }),
        dateLabel: 'last_month',
      };
    case 'last_week':
      return {
        startDate: sub(new Date(), { weeks: 1 }),
        compareStatisticStartDate: sub(new Date(), { weeks: 2 }),
        dateLabel: 'last_week',
      };
    case 'last_year':
      return {
        startDate: sub(new Date(), { years: 1 }),
        compareStatisticStartDate: sub(new Date(), { years: 2 }),
        dateLabel: 'last_year',
      };
    default:
      return {
        startDate: sub(new Date(), { weeks: 1 }),
        compareStatisticStartDate: sub(new Date(), { weeks: 2 }),
        dateLabel: 'last_month',
      };
  }
};
const getDialogueStatistics = gql`
  query dialogueStatistics($customerSlug: String!, $dialogueSlug: String!, $prevDateFilter: DialogueFilterInputType, $statisticsDateFilter: DialogueFilterInputType) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        id
        countInteractions(input: $statisticsDateFilter)
        thisWeekAverageScore: averageScore(input: $statisticsDateFilter)
        previousScore: averageScore(input: $prevDateFilter)
        sessions(take: 3) {
          id
          createdAt
          score
          nodeEntries {
            relatedNode {
              title
              type
            }
            value {
              sliderNodeEntry
              textboxNodeEntry
              registrationNodeEntry
              choiceNodeEntry
              linkNodeEntry
            }
          }
        }
        statistics(input: $statisticsDateFilter) {
          topPositivePath {
            answer
            quantity
            basicSentiment
          }
          
          mostPopularPath {
            answer
            quantity
            basicSentiment
          }
          
          topNegativePath {
            quantity
            answer
            basicSentiment
          }
          
          history {
            x
            y
          }
        } 
      }
    }
  }
`;

const calcScoreIncrease = (currentScore: number, prevScore: number) => {
  if (!prevScore) return 100;

  return currentScore / prevScore || 0;
};

const DialogueView = () => {
  const { dialogueSlug, customerSlug } = useParams();
  const [activeDateState, dispatch] = useReducer(dateReducer, {
    startDate: sub(new Date(), { weeks: 1 }),
    compareStatisticStartDate: sub(new Date(), { weeks: 2 }),
    dateLabel: 'last_week',
  });

  const history = useHistory();

  // TODO: Move this to page level
  const { data } = useQuery<any>(getDialogueStatistics, {
    variables: {
      dialogueSlug,
      customerSlug,
      statisticsDateFilter: {
        startDate: activeDateState.startDate.toISOString(),
      },
      prevDateFilter: {
        endDate: activeDateState.compareStatisticStartDate.toISOString(),
      },
    },
    pollInterval: 5000,
  });

  const dialogue = data?.customer?.dialogue;

  const increaseInAverageScore = calcScoreIncrease(dialogue?.thisWeekAverageScore, dialogue?.previousScore);

  const { t } = useTranslation();

  const makeSearchUrl = () => {
    if (!dialogue.statistics?.mostPopularPath?.answer) return '';

    return qs.stringify({ search: dialogue.statistics?.mostPopularPath?.answer });
  };

  if (!dialogue) return <Loader />;

  return (
    <DialogueViewContainer>
      <Flex justifyContent="space-between">
        <PageTitle>
          <Icon as={BarChart} mr={1} />
          {t('views:dialogue_view')}
        </PageTitle>
        <DatePickerExpanded activeLabel={activeDateState.dateLabel} dispatch={dispatch} />
      </Flex>
      <Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr 1fr']}>
        <Div gridColumn="1 / 4">
          <H4 color="default.darker" mb={4}>
            <Flex>
              <Div width="20px">
                <TrendingIcon fill="currentColor" />
              </Div>
              <Span ml={2}>
                {t(`dialogue:${activeDateState.dateLabel}_summary`)}
              </Span>
            </Flex>
          </H4>

          <Grid gridTemplateColumns="repeat(auto-fit, minmax(275px, 1fr))" minHeight="100px">
            <SummaryModule
              heading={t('interactions')}
              renderIcon={Activity}
              onClick={() => (
                history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`)
              )}
              isInFallback={dialogue.countInteractions === 0}
              fallbackMetric={t('dialogue:fallback_no_interactions')}
              renderMetric={`${dialogue.countInteractions} ${dialogue.countInteractions > 1 ? t('interactions') : t('interaction')}`}
            />

            <SummaryModule
              heading={t('dialogue:average_score')}
              renderIcon={Award}
              isInFallback={dialogue.thisWeekAverageScore === 0}
              fallbackMetric={t('dialogue:fallback_no_score')}
              renderMetric={`${(dialogue.thisWeekAverageScore / 10).toFixed(2)} ${t('score')}`}
              renderCornerMetric={(
                <Flex color="red">
                  {increaseInAverageScore > 0 ? (
                    <>
                      <Icon size="22px" as={TrendingUp} color="green.200" />
                      <Text fontWeight={600} fontSize="0.9rem" ml={1} color="green.400">
                        {increaseInAverageScore.toFixed(2)}
                        {' '}
                        %
                      </Text>
                    </>
                  ) : (
                    <>
                      <Icon size="22px" as={TrendingDown} color="red.200" />
                      <Text fontWeight={600} fontSize="0.9rem" ml={1} color="red.400">
                        {increaseInAverageScore.toFixed(2)}
                        {' '}
                        %
                      </Text>
                    </>
                  )}
                </Flex>
              )}
            />

            <SummaryModule
              heading={t('dialogue:frequently_mentioned')}
              renderIcon={MessageCircle}
              renderFooterText={t('dialogue:view_all_mentions')}
              isInFallback={!dialogue.statistics?.mostPopularPath}
              onClick={() => (
                history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions?${makeSearchUrl()}`)
              )}
              fallbackMetric={t('dialogue:fallback_no_keywords')}
              renderMetric={dialogue.statistics?.mostPopularPath?.answer}
              renderCornerMetric={(
                <>
                  {dialogue.statistics?.mostPopularPath?.basicSentiment === 'positive' ? (
                    <Tag size="sm" variantColor="green">
                      <TagIcon icon={ThumbsUp} size="10px" color="green.600" />
                      <TagLabel color="green.600">{dialogue.statistics?.mostPopularPath?.quantity}</TagLabel>
                    </Tag>
                ) : (
                  <Tag size="sm" variantColor="red">
                    <TagIcon icon={ThumbsDown} size="10px" color="red.600" />
                    <TagLabel color="red.600">{dialogue.statistics?.mostPopularPath?.quantity}</TagLabel>
                  </Tag>
                )}
                </>
              )}
            />
          </Grid>
        </Div>

        <Div mt={2} gridColumn="1 / 4">
          <H4 color="default.darker" mb={4}>
            <Flex>
              <Div width="20px">
                <PathsIcon fill="currentColor" />
              </Div>
              <Span ml={2}>
                {t(`dialogue:notable_paths_of_${activeDateState.dateLabel}`)}
              </Span>
            </Flex>
          </H4>
          <Grid gridTemplateColumns="1fr 1fr">
            <PositivePathsModule positivePaths={dialogue.statistics?.topPositivePath} />
            <NegativePathsModule negativePaths={dialogue.statistics?.topNegativePath} />
          </Grid>
        </Div>

        <Div gridColumn="span 3">
          <H4 color="default.darker">
            <Flex>
              <Div width="20px">
                <TrophyIcon fill="currentColor" />
              </Div>
              <Span ml={2}>
                {t('dialogue:latest_data')}
              </Span>
            </Flex>
          </H4>
        </Div>

        <Div gridColumn="span 2">
          {dialogue.statistics?.history ? (
            <ScoreGraphModule chartData={dialogue.statistics?.history} />
          ) : (
            <Div>{t('no_data')}</Div>
          )}
        </Div>

        <InteractionFeedModule interactions={dialogue?.sessions} />
      </Grid>
    </DialogueViewContainer>
  );
};

export default DialogueView;
