import * as Popover from '@radix-ui/react-popover';
import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
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
import React, { useState } from 'react';
import styled from 'styled-components';

import { DateFormat, useDate } from 'hooks/useDate';
import { ProgressCircle } from 'components/Analytics/WorkspaceGrid/SummaryPane/ProgressCircle';
import { ReactComponent as QRIcon } from 'assets/icons/icon-qr.svg';
import {
  getColorScoreBrandVariable,
  getHexagonSVGFill,
} from 'components/Analytics/WorkspaceGrid/WorkspaceGrid.helpers';
import { slideUpFadeMotion } from 'components/animation/config';
import { useCustomer } from 'providers/CustomerProvider';
import { useDialogue } from 'providers/DialogueProvider';
import { useFormatter } from 'hooks/useFormatter';
import { useGetDialogueLayoutDetailsQuery } from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';

import { ShareDialogue } from './ShareDialogue';
import { TopSubNavBarContainer } from './TopSubNavBar.styles';

const Content = styled(Popover.Content)`
  transform-origin: var(--radix-popover-content-transform-origin);
`;

export const DialogueTopNavBar = () => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();
  const { activeDialogue } = useDialogue();
  const { formatFractionToPercentage } = useFormatter();
  const { getNWeekAgo, format, getTomorrow } = useDate();
  const [isShareDialogueOpen, setIsShareDialogueOpen] = useState(false);

  const { dashboardPath, workspaceInteractionsPath, customerSlug, dialogueSlug } = useNavigator();

  console.log('Active dialogue top nav bar: ', activeDialogue);

  const { data } = useGetDialogueLayoutDetailsQuery({
    fetchPolicy: 'no-cache',
    variables: {
      workspaceId: activeCustomer?.id || '',
      dialogueId: activeDialogue?.id as string,
      healthInput: {
        startDateTime: format(getNWeekAgo(1), DateFormat.DayFormat),
        endDateTime: format(getTomorrow(), DateFormat.DayFormat),
      },
    },
  });

  const health = data?.customer?.dialogue?.healthScore;
  const score = health?.score;
  const total = health?.nrVotes || 0;
  const positive = total - (health?.negativeResponseCount || 0);

  const shareUrl = `https://client.haas.live/${customerSlug}/${activeDialogue?.slug}`;

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
                  <UI.Flex>
                    <UI.Div>
                      {' '}
                      {activeDialogue?.title}
                    </UI.Div>
                    <Popover.Root open={isShareDialogueOpen} onOpenChange={setIsShareDialogueOpen}>
                      <Popover.Trigger asChild>
                        <UI.Button leftIcon={() => <QRIcon />} ml={4} size="sm">
                          {t('share')}
                        </UI.Button>
                      </Popover.Trigger>
                      <AnimatePresence>
                        {isShareDialogueOpen && (
                          <Content
                            align="start"
                            asChild
                            forceMount
                            forwardedAs={motion.div}
                            {...slideUpFadeMotion}
                          >
                            <motion.div style={{ background: 'white' }}>
                              <ShareDialogue dialogueName={activeDialogue?.slug} shareUrl={shareUrl} />
                            </motion.div>
                          </Content>
                        )}
                      </AnimatePresence>
                    </Popover.Root>
                  </UI.Flex>

                </UI.ViewTitle>
                {total > 0 ? (
                  <UI.ViewSubTitle>
                    {positive}
                    {' '}
                    of
                    {' '}
                    {total}
                    {' '}
                    respondents are happy
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
            </UI.Div>
          </UI.Div>
        </UI.Flex>
      </UI.Container>
    </TopSubNavBarContainer>
  );
};
