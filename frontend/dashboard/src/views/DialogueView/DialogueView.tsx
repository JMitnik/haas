import * as qs from 'qs';
import { Activity, Award, BarChart, MessageCircle,
  ThumbsDown, ThumbsUp, TrendingDown, TrendingUp } from 'react-feather';
import { Div, Flex, Grid, H4, Icon, Loader, PageTitle, Span, Text } from '@haas/ui';
import { Tag, TagIcon, TagLabel } from '@chakra-ui/core';
import { sub } from 'date-fns';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
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

// TODO: Bring it back
// const filterMap = new Map([
//   ['Last 24h', 1],
//   ['Last week', 7],
//   ['Last month', 30],
//   ['Last year', 365],
// ]);

const DialogueViewContainer = styled(Div)`
  ${() => css`
    ${H4} {
      font-size: 1.2rem;
    }
  `}
`;

const getDialogueStatistics = gql`
  query dialogueStatistics($customerSlug: String!, $dialogueSlug: String!, $prevDateFilter: DialogueFilterInputType) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        id
        countInteractions
        thisWeekAverageScore: averageScore
        previousScore: averageScore(input: $prevDateFilter)
        sessions(take: 4) {
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
        statistics {
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
  const [prevWeekDate] = useState(() => sub(new Date(), {
    weeks: 1,
  }).toISOString());

  const history = useHistory();

  // FIXME: If this is started with anything else start result is undefined :S
  // const [activeFilter, setActiveFilter] = useState(() => 'Last 24h');

  // TODO: Move this to page level
  const { data } = useQuery<any>(getDialogueStatistics, {
    variables: {
      dialogueSlug,
      customerSlug,
      prevDateFilter: {
        endDate: prevWeekDate,
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
      <PageTitle>
        <Icon as={BarChart} mr={1} />
        {t('views:dialogue_view')}
      </PageTitle>
      <Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr 1fr']}>
        <Div gridColumn="1 / 4">
          <H4 color="default.darker" mb={4}>
            <Flex>
              <Div width="20px">
                <TrendingIcon fill="currentColor" />
              </Div>
              <Span ml={2}>
                This week in summary
              </Span>
            </Flex>
          </H4>

          <Grid gridTemplateColumns="repeat(auto-fit, minmax(275px, 1fr))" minHeight="100px">
            <SummaryModule
              heading="Interactions"
              renderIcon={Activity}
              isInFallback={dialogue.countInteractions === 0}
              fallbackMetric="No interactions yet"
              renderMetric={`${dialogue.countInteractions} ${dialogue.countInteractions > 1 ? 'interactions' : 'interaction'}`}
            />

            <SummaryModule
              heading="Average score"
              renderIcon={Award}
              isInFallback={dialogue.thisWeekAverageScore === 0}
              fallbackMetric="No score calculated yet"
              renderMetric={`${(dialogue.thisWeekAverageScore / 10).toFixed(2)} score`}
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
              heading="Frequently mentioned"
              renderIcon={MessageCircle}
              renderFooterText="View all mentions"
              isInFallback={!dialogue.statistics?.mostPopularPath}
              onClick={() => (
                history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions?${makeSearchUrl()}`)
              )}
              fallbackMetric="No keywords mentioned yet"
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
                Notable paths of the week
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
                The latest data
              </Span>
            </Flex>
          </H4>
        </Div>

        <Div gridColumn="span 2">
          {dialogue.statistics?.history ? (
            <ScoreGraphModule chartData={dialogue.statistics?.history} />
          ) : (
            // TODO: Make a nice card for this
            <Div>
              Currently no history data available
            </Div>
          )}
        </Div>

        <InteractionFeedModule interactions={dialogue?.sessions} />
      </Grid>
    </DialogueViewContainer>
  );
};

export default DialogueView;
