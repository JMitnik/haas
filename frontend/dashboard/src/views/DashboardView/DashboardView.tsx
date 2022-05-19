import * as Popover from '@radix-ui/react-popover';
import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { useClipboard } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import styled from 'styled-components';

import { View } from 'layouts/View';
import { WorkspaceGridAdapter } from 'components/Analytics/WorkspaceGrid/WorkspaceGridAdapter';
import { slideUpFadeMotion } from 'components/animation/config';
import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';
import theme from 'config/theme';

import { getDayGreeting } from './DashboardView.helpers';

const Content = styled(Popover.Content)`
  transformOrigin: var(--radix-popover-content-transform-origin);
`;

export const DashboardView = () => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();
  const { user } = useUser();
  const shareUrl = `${window.location.origin}/public/dialogue-link-fetch?workspaceId=${activeCustomer?.id}`;

  const { onCopy, hasCopied } = useClipboard(shareUrl);

  const dayGreeting = getDayGreeting();
  const [showShare, setShowShare] = useState(false);

  return (
    <View documentTitle="haas | Overview">
      <UI.ViewHead>
        <UI.Flex alignItems="flex-end">
          <UI.Div mr={4}>
            <UI.ViewTitle>
              {t('overview')}
            </UI.ViewTitle>
            <UI.ViewSubTitle>
              {t(dayGreeting, { user: user?.firstName })}
            </UI.ViewSubTitle>
          </UI.Div>

          <UI.Div>
            <Popover.Root open={showShare} onOpenChange={setShowShare}>
              <Popover.Trigger asChild>
                <UI.Button ml={4} size="sm">
                  {t('share')}
                </UI.Button>
              </Popover.Trigger>
              <AnimatePresence>
                {showShare && (
                  <Content
                    sideOffset={10}
                    align="start"
                    asChild
                    forceMount
                    forwardedAs={motion.div}
                    {...slideUpFadeMotion}
                  >
                    <motion.div>
                      <UI.NewCard minWidth={500}>
                        <UI.CardBody>
                          <UI.Div mb={2}>
                            <UI.H4 color="off.500">
                              Share dialogues
                            </UI.H4>
                            <UI.Text color="off.500">
                              Share your dialogues with your team and get feedback from their people.
                            </UI.Text>
                          </UI.Div>

                          <UI.Div>
                            <UI.Div>
                              <UI.Helper mb={1}>Link hub</UI.Helper>
                              <UI.Input
                                mt={2}
                                rightEl={(
                                  <UI.Button width="auto" size="sm" onClick={onCopy}>
                                    {hasCopied ? 'Copied' : 'Copy'}
                                  </UI.Button>
                                )}
                                borderRadius={10}
                                value={shareUrl}
                                isReadOnly
                              />
                            </UI.Div>
                          </UI.Div>
                        </UI.CardBody>
                      </UI.NewCard>
                    </motion.div>
                  </Content>
                )}
              </AnimatePresence>
            </Popover.Root>
          </UI.Div>
        </UI.Flex>
      </UI.ViewHead>
      <UI.ViewBody>
        <UI.Div>
          <UI.Grid gridTemplateRows="1fr 2fr">
            <UI.Div>
              <WorkspaceGridAdapter
                backgroundColor={theme.colors.neutral[500]}
                height={600}
                width={900}
              />
            </UI.Div>
          </UI.Grid>
        </UI.Div>
      </UI.ViewBody>
    </View>
  );
};
