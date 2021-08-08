import * as UI from '@haas/ui';
import * as qs from 'qs';
import {
  Activity, Award, Clipboard, Download, MessageCircle,
  ThumbsDown, ThumbsUp, TrendingDown, TrendingUp,
} from 'react-feather';
import { Button, Tag, TagIcon, TagLabel, useClipboard } from '@chakra-ui/core';
import { ThemeContext } from 'styled-components';
import { gql, useQuery } from '@apollo/client';
import { sub } from 'date-fns';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import React, { useContext, useReducer, useRef } from 'react';

import { ReactComponent as ChartbarIcon } from 'assets/icons/icon-chartbar.svg';
import { ReactComponent as PathsIcon } from 'assets/icons/icon-launch.svg';
import { ReactComponent as QRIcon } from 'assets/icons/icon-qr.svg';
import { ReactComponent as TrendingIcon } from 'assets/icons/icon-trending-up.svg';
import { ReactComponent as TrophyIcon } from 'assets/icons/icon-trophy.svg';

import { useNavigator } from 'hooks/useNavigator';
import Dropdown from 'components/Dropdown';
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

interface ActiveDateAction {
  type: ActiveDateType;
}

interface DatePickerProps {
  activeLabel: ActiveDateType;
  dispatch: React.Dispatch<ActiveDateAction>;
}

const DatePickerExpanded = ({ activeLabel, dispatch }: DatePickerProps) => {
  const { t } = useTranslation();

  return (
    <UI.Div>
      <UI.Flex>
        <UI.Button
          size="sm"
          isActive={activeLabel === 'last_hour'}
          onClick={() => dispatch({ type: 'last_hour' })}
        >
          {t('dialogue:last_hour')}
        </UI.Button>
        <UI.Button
          ml={1}
          size="sm"
          isActive={activeLabel === 'last_day'}
          onClick={() => dispatch({ type: 'last_day' })}
        >
          {t('dialogue:last_day')}
        </UI.Button>
        <UI.Button
          ml={1}
          size="sm"
          isActive={activeLabel === 'last_week'}
          onClick={() => dispatch({ type: 'last_week' })}
        >
          {t('dialogue:last_week')}

        </UI.Button>
        <UI.Button
          size="sm"
          ml={1}
          isActive={activeLabel === 'last_month'}
          onClick={() => dispatch({ type: 'last_month' })}
        >
          {t('dialogue:last_month')}

        </UI.Button>
      </UI.Flex>
    </UI.Div>
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
        title
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
          nrInteractions
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

interface ShareDialogueDropdownProps {
  dialogueName: string;
  shareUrl: string;
}

const ShareDialogue = ({ dialogueName, shareUrl }: ShareDialogueDropdownProps) => {
  const themeContext = useContext(ThemeContext);

  const qrColor = themeContext.colors.primary || '#FFFFFF';
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const { onCopy, hasCopied } = useClipboard(shareUrl);

  const handleDownload = (): void => {
    if (!qrContainerRef.current) return;

    const canvas = qrContainerRef.current.querySelector('canvas');
    if (!canvas) return;

    const img = canvas.toDataURL('image/png');
    const anchor = document.createElement('a');
    anchor.href = img;
    anchor.download = `QRCode-${dialogueName}.png`;
    anchor.click();
  };

  const { t } = useTranslation();

  return (
    <UI.Card zIndex={500} noHover bg="white" width="400px" maxWidth="100%">
      <UI.CardBody>
        <UI.Div />
        <UI.Div mb={4}>
          <UI.Text fontWeight={600} fontSize="1.3rem" color="gray.700">{t('dialogue:share_qr')}</UI.Text>
          <UI.Hr />
          <UI.Grid pt={2} gridTemplateColumns="1fr 1fr">
            <UI.Div>
              <UI.Text color="gray.500" fontSize="0.8rem">
                {t('dialogue:qr_download_helper')}
              </UI.Text>
            </UI.Div>
            <UI.ColumnFlex alignItems="center">
              <UI.Div ref={qrContainerRef}>
                <QRCode fgColor={qrColor} value={shareUrl} />
              </UI.Div>
              <Button
                margin="0 auto"
                onClick={handleDownload}
                as="a"
                variantColor="teal"
                mt={1}
                size="xs"
                leftIcon={() => <Download size={12} />}
              >
                <UI.Text ml={1}>Download</UI.Text>
              </Button>
            </UI.ColumnFlex>
          </UI.Grid>
        </UI.Div>
        <UI.Div mb={4}>
          <UI.Text fontWeight={600} fontSize="1.3rem" color="gray.700">{t('dialogue:share_link')}</UI.Text>
          <UI.Hr />

          <UI.Flex>
            <UI.Div flexGrow={1} pt={2}>
              <UI.Input
                rightEl={(
                  <UI.Button width="auto" size="sm" onClick={onCopy} leftIcon={Clipboard}>
                    {hasCopied ? 'Copied' : 'Copy'}
                  </UI.Button>
                )}
                value={shareUrl}
                isReadOnly
              />
            </UI.Div>

          </UI.Flex>
        </UI.Div>
      </UI.CardBody>
    </UI.Card>
  );
};

const calcScoreIncrease = (currentScore: number, prevScore: number) => {
  if (!prevScore) return 100;

  return currentScore / prevScore || 0;
};

const DialogueView = () => {
  const { dialogueSlug, customerSlug } = useParams<{ customerSlug: string, dialogueSlug: string }>();
  const [activeDateState, dispatch] = useReducer(dateReducer, {
    startDate: sub(new Date(), { weeks: 1 }),
    compareStatisticStartDate: sub(new Date(), { weeks: 2 }),
    dateLabel: 'last_week',
  });
  const { getDialoguesPath } = useNavigator();

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

  if (!dialogue) return <UI.Loader />;
  const shareUrl = `https://client.haas.live/${customerSlug}/${dialogueSlug}`;

  return (
    <>
      <UI.ViewHead renderBreadCrumb={<UI.Breadcrumb to={getDialoguesPath()}>{t('go_to_dialogues')}</UI.Breadcrumb>}>
        <UI.Flex alignItems="center" justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <UI.ViewTitle leftIcon={<ChartbarIcon />}>
              {t('views:dialogue_view')}
            </UI.ViewTitle>
            <Dropdown
              renderOverlay={() => <ShareDialogue dialogueName={dialogueSlug} shareUrl={shareUrl} />}
            >
              {({ onOpen }) => (
                <UI.Button onClick={onOpen} variantColor="teal" leftIcon={QRIcon} ml={4} size="sm">
                  {t('share')}
                </UI.Button>
              )}
            </Dropdown>
          </UI.Flex>

          <UI.Flex justifyContent="space-between" flexWrap="wrap">
            <DatePickerExpanded activeLabel={activeDateState.dateLabel} dispatch={dispatch} />
          </UI.Flex>
        </UI.Flex>
      </UI.ViewHead>
      <UI.ViewBody>
        <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr 1fr']}>
          <UI.Div gridColumn="1 / 4">
            <UI.H4 color="default.darker" mb={4}>
              <UI.Flex>
                <UI.Div width="20px">
                  <TrendingIcon fill="currentColor" />
                </UI.Div>
                <UI.Span ml={2}>
                  {t(`dialogue:${activeDateState.dateLabel}_summary`)}
                </UI.Span>
              </UI.Flex>
            </UI.H4>

            <UI.Grid gridTemplateColumns="repeat(auto-fit, minmax(275px, 1fr))" minHeight="100px">
              <SummaryModule
                heading={t('interactions')}
                renderIcon={Activity}
                onClick={() => (
                  history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`)
                )}
                isInFallback={dialogue.statistics.nrInteractions === 0}
                fallbackMetric={t('dialogue:fallback_no_interactions')}
                renderMetric={`${dialogue.statistics.nrInteractions} ${dialogue.statistics.nrInteractions > 1 ? t('interactions') : t('interaction')}`}
              />

              <SummaryModule
                heading={t('dialogue:average_score')}
                renderIcon={Award}
                isInFallback={dialogue.thisWeekAverageScore === 0}
                fallbackMetric={t('dialogue:fallback_no_score')}
                renderMetric={`${(dialogue.thisWeekAverageScore / 10).toFixed(2)} ${t('score')}`}
                renderCornerMetric={(
                  <UI.Flex color="red">
                    {increaseInAverageScore > 0 ? (
                      <>
                        <UI.Icon size="22px" as={TrendingUp} color="green.200" />
                        <UI.Text fontWeight={600} fontSize="0.9rem" ml={1} color="green.400">
                          {increaseInAverageScore.toFixed(2)}
                          {' '}
                          %
                        </UI.Text>
                      </>
                    ) : (
                      <>
                        <UI.Icon size="22px" as={TrendingDown} color="red.200" />
                        <UI.Text fontWeight={600} fontSize="0.9rem" ml={1} color="red.400">
                          {increaseInAverageScore.toFixed(2)}
                          {' '}
                          %
                        </UI.Text>
                      </>
                    )}
                  </UI.Flex>
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
            </UI.Grid>
          </UI.Div>

          <UI.Div mt={2} gridColumn="1 / 4">
            <UI.H4 color="default.darker" mb={4}>
              <UI.Flex>
                <UI.Div width="20px">
                  <PathsIcon fill="currentColor" />
                </UI.Div>
                <UI.Span ml={2}>
                  {t(`dialogue:notable_paths_of_${activeDateState.dateLabel}`)}
                </UI.Span>
              </UI.Flex>
            </UI.H4>
            <UI.Grid gridTemplateColumns="1fr 1fr">
              <PositivePathsModule positivePaths={dialogue.statistics?.topPositivePath} />
              <NegativePathsModule negativePaths={dialogue.statistics?.topNegativePath} />
            </UI.Grid>
          </UI.Div>

          <UI.Div gridColumn="span 3">
            <UI.H4 color="default.darker">
              <UI.Flex>
                <UI.Div width="20px">
                  <TrophyIcon fill="currentColor" />
                </UI.Div>
                <UI.Span ml={2}>
                  {t('dialogue:latest_data')}
                </UI.Span>
              </UI.Flex>
            </UI.H4>
          </UI.Div>

          <UI.Div gridColumn="span 2">
            {dialogue.statistics?.history ? (
              <ScoreGraphModule chartData={dialogue.statistics?.history} />
            ) : (
              <UI.Div>{t('no_data')}</UI.Div>
            )}
          </UI.Div>

          <InteractionFeedModule interactions={dialogue?.sessions} />
        </UI.Grid>
      </UI.ViewBody>
    </>
  );
};

export default DialogueView;
