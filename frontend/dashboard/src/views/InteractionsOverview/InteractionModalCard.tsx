import * as UI from '@haas/ui';
import { CampaignTimeline } from 'components/Campaign/CampaignTimeline';
import { Circle } from 'components/Common/Circle';
import { Clock, Mail, MessageCircle, Monitor, Phone, ThumbsUp, User } from 'react-feather';
import { Timeline, TimelineItem } from 'components/Common/Timeline';
import React from 'react';

import { CampaignVariantEnum, useGetInteractionQuery } from 'types/generated-types';
import { InteractionTimeline } from 'components/Interaction/InteractionTimeline';
import { formatSimpleDate } from 'utils/dateUtils';
import { useNavigator } from 'hooks/useNavigator';
import { useTranslation } from 'react-i18next';

interface InteractionModalCardProps {
  sessionId: string;
  onClose: () => void;
}

export const InteractionModalCard = ({ onClose, sessionId }: InteractionModalCardProps) => {
  const { goToDeliveryView } = useNavigator();
  const { t } = useTranslation();
  const { data, loading, error } = useGetInteractionQuery({
    variables: { sessionId },
  });

  if (loading) {
    return <UI.Loader />;
  }

  const delivery = data?.session?.delivery;

  return (
    <UI.ModalCard maxWidth={1200} onClose={onClose}>
      <UI.ModalHead>
        <UI.ModalTitle>
          {t('interaction')}
        </UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        {data && (
          <Timeline>
            {!!delivery && (
              <TimelineItem gridTemplateColumns="40px 1fr">
                <Circle brand="teal">
                  <MessageCircle />
                </Circle>
                <UI.Div>
                  <UI.Div mb={2} color="teal.700">
                    <UI.SectionHeader>{t('dialogue_via_delivery')}</UI.SectionHeader>
                    <UI.Div my={1}>
                      <UI.Stack isInline>
                        <UI.Label colorScheme="teal" size="sm" fontSize="0.6rem">
                          <UI.Icon mr={1}><User width="0.8rem" /></UI.Icon>
                          {delivery.deliveryRecipientFirstName}
                          {' '}
                          {delivery.deliveryRecipientLastName}
                        </UI.Label>
                        {delivery.campaignVariant?.type === CampaignVariantEnum.Email && (
                          <UI.Label colorScheme="teal" size="sm" fontSize="0.6rem">
                            <UI.Icon mr={1}><Mail width="0.8rem" /></UI.Icon>
                            {delivery.deliveryRecipientEmail}
                          </UI.Label>
                        )}
                        {delivery.campaignVariant?.type === CampaignVariantEnum.Sms && (
                          <UI.Label colorScheme="teal" size="sm" fontSize="0.6rem">
                            <UI.Icon mr={1}><Phone width="0.8rem" /></UI.Icon>
                            {delivery.deliveryRecipientPhone}
                          </UI.Label>
                        )}
                      </UI.Stack>
                    </UI.Div>
                    <UI.Button
                      size="xs"
                      onClick={() => goToDeliveryView(delivery.campaignVariant?.campaign?.id || '', delivery.id)}
                    >
                      {t('go_to_delivery')}
                    </UI.Button>
                  </UI.Div>
                  <CampaignTimeline delivery={delivery} />
                </UI.Div>
              </TimelineItem>
            )}
            {!!data.session && (
              <TimelineItem gridTemplateColumns="40px 1fr">
                <Circle brand="blue">
                  <ThumbsUp />
                </Circle>
                <UI.Div>

                  <UI.Div mb={2} color="blue.700">
                    <UI.SectionHeader>{t('entries')}</UI.SectionHeader>
                    <UI.Span>
                      {t('opened_on')}
                      {' '}
                      {formatSimpleDate(data.session?.createdAt)}
                    </UI.Span>
                    <UI.Div mt={1}>
                      <UI.Stack isInline>
                        <UI.Label colorScheme="blue" size="sm" fontSize="0.6rem">
                          <UI.Icon mr={1}><Monitor width="0.8rem" /></UI.Icon>
                          {data.session.device}
                        </UI.Label>
                        <UI.Label colorScheme="blue" size="sm" fontSize="0.6rem">
                          <UI.Icon mr={1}><Clock width="0.8rem" /></UI.Icon>
                          {data.session.totalTimeInSec}
                          {' '}
                          {t('seconds')}
                        </UI.Label>
                      </UI.Stack>
                    </UI.Div>
                  </UI.Div>
                  <UI.Div>
                    <InteractionTimeline interaction={data.session} />
                  </UI.Div>
                </UI.Div>
              </TimelineItem>
            )}
          </Timeline>
        )}
        {error && (
          <UI.ErrorPane header="Server problem" text={error.message} />
        )}
      </UI.ModalBody>
    </UI.ModalCard>
  );
};
