import * as Popover from '@radix-ui/react-popover';
import * as UI from '@haas/ui';
import * as qs from 'qs';
import {
  AlertTriangle, Award, Clipboard, Download, MessageCircle,
  ThumbsDown, ThumbsUp, TrendingDown, TrendingUp, User,
} from 'react-feather';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { Tag, TagIcon, TagLabel, useClipboard } from '@chakra-ui/core';
import { Zoom } from '@visx/zoom';
import { endOfDay, sub } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import React, { useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';

import * as Modal from 'components/Common/Modal';
import { AnimatePresence, motion } from 'framer-motion';
import { DatePicker } from 'components/Common/DatePicker';
import {
  GetDialogueStatisticsQuery, useGetDialogueStatisticsQuery, useGetSessionPathsQuery,
} from 'types/generated-types';
import { InteractionModalCard } from 'views/InteractionsOverview/InteractionModalCard';
import { ReactComponent as QRIcon } from 'assets/icons/icon-qr.svg';

import { DateFormat, useDate } from 'hooks/useDate';
import { GradientLightgreenGreen, GradientOrangeRed, GradientPinkRed, GradientSteelPurple, LinearGradient } from '@visx/gradient';
import { HexagonGrid } from 'components/Analytics/WorkspaceGrid/HexagonGrid';
import { HexagonNode, HexagonNodeType, HexagonSessionNode } from 'components/Analytics/WorkspaceGrid/WorkspaceGrid.types';
import { PatternCircles } from '@visx/pattern';
import { Statistic } from 'components/Analytics/WorkspaceGrid/Statistic';
import { View } from 'layouts/View';
import { createGrid } from 'components/Analytics/WorkspaceGrid/WorkspaceGrid.helpers';
import { slideUpFadeMotion } from 'components/animation/config';
import { useDialogue } from 'providers/DialogueProvider';
import { useNavigator } from 'hooks/useNavigator';
import useMeasure from 'react-use-measure';
import InteractionFeedModule from './Modules/InteractionFeedModule/InteractionFeedModule';
import ScoreGraphModule from './Modules/ScoreGraphModule';
import SummaryModule from './Modules/SummaryModules/SummaryModule';

const Content = styled(Popover.Content)`
  transformOrigin: var(--radix-popover-content-transform-origin);
`;

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

interface ShareDialogueDropdownProps {
  dialogueName: string;
  shareUrl: string;
}

const ShareDialogue = ({ dialogueName, shareUrl }: ShareDialogueDropdownProps) => {
  // @ts-ignore
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
    <UI.Card maxWidth={500}>
      <UI.CardBody>
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
                {/* @ts-ignore */}
                <QRCode fgColor={qrColor} value={`${shareUrl}?origin=qrc`} />
              </UI.Div>
              <UI.Button
                margin="0 auto"
                onClick={handleDownload}
                as="a"
                variantColor="teal"
                mt={1}
                size="xs"
                leftIcon={() => <Download size={12} />}
              >
                <UI.Text ml={1}>Download</UI.Text>
              </UI.Button>
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
                  <UI.Button width="auto" size="sm" onClick={onCopy} leftIcon={() => <Clipboard />}>
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
  const [ref, bounds] = useMeasure();
  const initialRef = React.useRef<HTMLDivElement>();
  const width = bounds.width || 600;
  const height = Math.max(bounds.height, 500);
  const [activeDateState, dispatch] = useReducer(dateReducer, {
    startDate: sub(new Date(), { weeks: 1 }),
    compareStatisticStartDate: sub(new Date(), { weeks: 2 }),
    dateLabel: 'last_week',
  });
  const { dialogueSlug, customerSlug } = useNavigator();
  const history = useHistory();
  const { t } = useTranslation();
  const { format, getOneWeekAgo, getEndOfToday } = useDate();
  const { activeDialogue } = useDialogue();

  console.log('Active dialogue: ', activeDialogue);

  // Session-id if currently being tracked.
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  /**
   * Cache dialogue statistics data when switching between date filters.
   * */
  const [
    cachedDialogueCustomer,
    setCachedDialogueCustomer,
  ] = useState<GetDialogueStatisticsQuery['customer'] | undefined>(undefined);

  const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
    const startDate = getOneWeekAgo();
    const endDate = getEndOfToday();

    return [startDate, endDate];
  });

  const [selectedStartDate, selectedEndDate] = dateRange;

  console.log('Date range: ', dateRange);

  const { data, loading } = useGetDialogueStatisticsQuery({
    variables: {
      dialogueSlug,
      customerSlug,
      startDateTime: format(selectedStartDate, DateFormat.DayTimeFormat),
      endDateTime: format(endOfDay(selectedEndDate), DateFormat.DayTimeFormat),
      issueFilter: {
        startDate: format(selectedStartDate, DateFormat.DayTimeFormat),
        endDate: format(endOfDay(selectedEndDate), DateFormat.DayTimeFormat),
      },
      statisticsDateFilter: {
        startDate: activeDateState.startDate.toISOString(),
      },
      prevDateFilter: {
        endDate: activeDateState.compareStatisticStartDate.toISOString(),
      },
    },
    // pollInterval: 5000,
  });

  const { data: sessionData } = useGetSessionPathsQuery({
    variables: {
      dialogueId: activeDialogue?.id as string,
      input: {
        startDateTime: format(selectedStartDate, DateFormat.DayTimeFormat),
        endDateTime: format(endOfDay(selectedEndDate), DateFormat.DayTimeFormat),
        path: [],
        issueOnly: false,
        refresh: true,
      },
    },
  });

  const pathedSessions: HexagonNode[] = sessionData?.dialogue?.pathedSessionsConnection?.pathedSessions?.map(
    (session) => ({
      id: session.id,
      label: session.id,
      type: HexagonNodeType.Session,
      score: session.score,
      session,
    }),
  ) || [];

  /**
   * Generates an array of Hexagon SVG coordinates according to the desired shape.
   *
   * The entries in the array correspond to `currentState.childNodes`, and can be accessed by the indices.
   */
  const gridItems = useMemo(() => (
    createGrid(
      pathedSessions.length || 0,
      initialRef.current?.clientHeight || 495,
      initialRef.current?.clientWidth || 495,
    )
  ), [pathedSessions]);

  /**
   * Adds the generated SVG coordinates to the hexagon nodes.
   */
  const hexagonNodes = pathedSessions.map((node, index) => ({
    ...node,
    id: node.id,
    points: gridItems.points[index],
  })) || [];

  useEffect(() => {
    if (data && !loading) {
      setCachedDialogueCustomer(data?.customer);
    }
  }, [data, loading]);
  const [isShareDialogueOpen, setIsShareDialogueOpen] = useState(false);

  if (!cachedDialogueCustomer) return <UI.Loader />;
  const { dialogue } = cachedDialogueCustomer;

  const increaseInAverageScore = calcScoreIncrease(
    dialogue?.thisWeekAverageScore || 0,
    dialogue?.previousScore || 0,
  );

  const makeSearchUrl = () => {
    if (!dialogue?.statistics?.mostPopularPath?.answer) return '';

    return qs.stringify({ search: dialogue?.statistics?.mostPopularPath?.answer });
  };

  const shareUrl = `https://client.haas.live/${customerSlug}/${dialogueSlug}`;

  const fetchStatus = {
    isRefreshing: loading && !!dialogue,
    isLoading: loading,
  };

  const handleHexClick = (currentZoomHelper: ProvidedZoom<SVGElement>, clickedNode: HexagonNode) => {
    setSessionId((clickedNode as HexagonSessionNode).session.id || undefined);
  };

  return (
    <View documentTitle="haas | Dialogue">
      <UI.ViewHead>
        <UI.Div pb={4} position="relative" zIndex={10000}>
          <UI.Flex alignItems="center" justifyContent="space-between">
            <UI.Div>
              <UI.H4 fontSize="1.1rem" color="off.500">
                {t('overview')}
              </UI.H4>
              <UI.Span color="off.400" fontWeight={500}>
                {t('workspace_overview_description')}
              </UI.Span>
            </UI.Div>

            <UI.Div>
              <UI.Helper>Filters</UI.Helper>
              <UI.Flex mt={1}>
                <>
                  <DatePicker
                    type="range"
                    startDate={selectedStartDate}
                    endDate={selectedEndDate}
                    onChange={setDateRange}
                  />
                </>
              </UI.Flex>
            </UI.Div>
          </UI.Flex>
        </UI.Div>
      </UI.ViewHead>
      <UI.ViewBody>
        <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr', '1fr', '2fr 1fr']}>
          <UI.Div>
            <>
              <UI.Grid gridTemplateColumns="1fr 1fr 1fr">
                <Statistic
                  icon={<User height={40} width={40} />}
                  themeBg="green.500"
                  themeColor="white"
                  name="Responses"
                  value={dialogue?.dialogueStatisticsSummary?.nrVotes || 0}
                  onNavigate={() => null
                    //   goToWorkspaceFeedbackOverview(
                    //   findDialoguesInGroup([currentState.currentNode as HexagonNode]),
                    //   format(startOfDay(startDate), DateFormat.DayTimeFormat),
                    //   format(endOfDay(endDate), DateFormat.DayTimeFormat),
                    // )
                  }
                />
                <Statistic
                  icon={<AlertTriangle height={40} width={40} />}
                  themeBg="red.500"
                  themeColor="white"
                  name="Problems"
                  value={dialogue?.issues?.basicStats.responseCount || 0}
                  onNavigate={() => null
                    //   goToWorkspaceFeedbackOverview(
                    //   findDialoguesInGroup([currentState.currentNode as HexagonNode]),
                    //   format(startOfDay(startDate), DateFormat.DayTimeFormat),
                    //   format(endOfDay(endDate), DateFormat.DayTimeFormat),
                    //   55,
                    // )
                  }
                />
                <Statistic
                  icon={<MessageCircle height={40} width={40} />}
                  themeBg="main.500"
                  themeColor="white"
                  name="Action Requests"
                  value={dialogue?.issues?.actionRequiredCount || 0}
                  onNavigate={() => null
                    //   goToWorkspaceFeedbackOverview(
                    //   findDialoguesInGroup([currentState.currentNode as HexagonNode]),
                    //   format(startOfDay(startDate), DateFormat.DayTimeFormat),
                    //   format(endOfDay(endDate), DateFormat.DayTimeFormat),
                    //   undefined,
                    //   true,
                    // )
                  }
                />
              </UI.Grid>
              <UI.Grid gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" mt={4}>
                <UI.Skeleton {...fetchStatus}>
                  <SummaryModule
                    heading={t('dialogue:average_score')}
                    renderIcon={Award}
                    isInFallback={dialogue?.thisWeekAverageScore === 0}
                    fallbackMetric={t('dialogue:fallback_no_score')}
                    renderMetric={`${(dialogue?.thisWeekAverageScore || 0 / 10).toFixed(2)} ${t('score')}`}
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
                </UI.Skeleton>
                <UI.Skeleton {...fetchStatus}>
                  <SummaryModule
                    heading={t('dialogue:frequently_mentioned')}
                    renderIcon={MessageCircle}
                    renderFooterText={t('dialogue:view_all_mentions')}
                    isInFallback={!dialogue?.statistics?.mostPopularPath}
                    onClick={() => (
                      history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions?${makeSearchUrl()}`)
                    )}
                    fallbackMetric={t('dialogue:fallback_no_keywords')}
                    renderMetric={dialogue?.statistics?.mostPopularPath?.answer}
                    renderCornerMetric={(
                      <>
                        {dialogue?.statistics?.mostPopularPath?.basicSentiment === 'positive' ? (
                          <Tag size="sm" variantColor="green">
                            <TagIcon icon={() => <ThumbsUp />} size="10px" color="green.600" />
                            <TagLabel color="green.600">{dialogue?.statistics?.mostPopularPath?.quantity}</TagLabel>
                          </Tag>
                        ) : (
                          <Tag size="sm" variantColor="red">
                            <TagIcon icon={() => <ThumbsDown />} size="10px" color="red.600" />
                            <TagLabel color="red.600">{dialogue?.statistics?.mostPopularPath?.quantity}</TagLabel>
                          </Tag>
                        )}
                      </>
                    )}
                  />
                </UI.Skeleton>
                <UI.Div gridColumn="1 / -1">
                  <UI.Skeleton {...fetchStatus}>
                    {/* @ts-ignore */}
                    <InteractionFeedModule interactions={dialogue?.sessions || []} />
                  </UI.Skeleton>
                </UI.Div>

              </UI.Grid>
            </>

          </UI.Div>
          <UI.Div width="100%" ref={ref} position="relative">
            <Zoom<SVGElement>
              width={width}
              height={height}
              scaleYMax={1.5}
              scaleYMin={0.5}
            >
              {(zoom) => (
                <HexagonGrid
                  key={`${selectedStartDate.toISOString()} - ${selectedEndDate.toISOString()}`}
                  width={width}
                  height={height}
                  backgroundColor="#ebf0ff"
                  nodes={hexagonNodes}
                  onHexClick={handleHexClick}
                  stateKey={dialogue?.id || ''}
                  zoom={zoom}
                  useBackgroundPattern
                >
                  <svg height={0}>
                    <PatternCircles id="circles" height={6} width={6} stroke="black" strokeWidth={1} />
                    <GradientOrangeRed id="dots-orange" />
                    <GradientPinkRed id="dots-pink" />
                    <GradientSteelPurple id="dots-gray" />
                    <LinearGradient id="grays" from="#757F9A" to="#939bb1" />
                    <GradientLightgreenGreen id="dots-green" />
                  </svg>
                </HexagonGrid>
              )}
            </Zoom>
          </UI.Div>
        </UI.Grid>
        <UI.Grid mt={4} gridTemplateColumns={['1fr']}>
          <UI.Div gridColumn="span 3">

            {dialogue?.statistics?.history ? (
              <UI.Skeleton {...fetchStatus}>
                {/* @ts-ignore */}
                <ScoreGraphModule chartData={dialogue?.statistics?.history || []} />
              </UI.Skeleton>
            ) : (
              <UI.Div>{t('no_data')}</UI.Div>
            )}

          </UI.Div>
        </UI.Grid>
      </UI.ViewBody>

      <Modal.Root open={!!sessionId} onClose={() => setSessionId(undefined)}>
        <InteractionModalCard
          sessionId={sessionId || ''}
        />
      </Modal.Root>
    </View>
  );
};

export default DialogueView;
