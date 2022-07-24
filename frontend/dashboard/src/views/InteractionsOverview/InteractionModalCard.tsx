import * as UI from '@haas/ui';
import { CampaignTimeline } from 'components/Campaign/CampaignTimeline';
import { Circle } from 'components/Common/Circle';
import { Clock, Mail, MessageCircle, Monitor, Phone, ThumbsUp, User } from 'react-feather';
import { Timeline, TimelineItem } from 'components/Common/Timeline';
import React from 'react';

import { CampaignVariantEnum, useGetInteractionQuery } from 'types/generated-types';
import { InteractionTimeline } from 'components/Interaction/InteractionTimeline';
import { formatSimpleDate } from 'utils/dateUtils';
import { useTranslation } from 'react-i18next';

interface InteractionModalCardProps {
  sessionId: string;
}

export const InteractionModalCard = ({ sessionId }: InteractionModalCardProps) => {
  const { t } = useTranslation();
  const { data, loading, error } = useGetInteractionQuery({
    variables: { sessionId },
  });

  const delivery = data?.session?.delivery;

  return (
    <>
      <UI.ModalHead>
        <UI.ModalTitle>
          {t('interaction')}
        </UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        {loading && !data && <UI.Loader />}
        {!loading && data && (
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
                        <UI.Label variantColor="teal" size="sm" fontSize="0.6rem">
                          <UI.Icon mr={1}><User width="0.8rem" /></UI.Icon>
                          {delivery.deliveryRecipientFirstName}
                          {' '}
                          {delivery.deliveryRecipientLastName}
                        </UI.Label>
                        {delivery.campaignVariant?.type === CampaignVariantEnum.Email && (
                          <UI.Label variantColor="teal" size="sm" fontSize="0.6rem">
                            <UI.Icon mr={1}><Mail width="0.8rem" /></UI.Icon>
                            {delivery.deliveryRecipientEmail}
                          </UI.Label>
                        )}
                        {delivery.campaignVariant?.type === CampaignVariantEnum.Sms && (
                          <UI.Label variantColor="teal" size="sm" fontSize="0.6rem">
                            <UI.Icon mr={1}><Phone width="0.8rem" /></UI.Icon>
                            {delivery.deliveryRecipientPhone}
                          </UI.Label>
                        )}
                      </UI.Stack>
                    </UI.Div>
                  </UI.Div>
                  <CampaignTimeline delivery={delivery as any} />
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
                        <UI.Label variantColor="blue" size="sm" fontSize="0.6rem">
                          <UI.Icon mr={1}><Monitor width="0.8rem" /></UI.Icon>
                          {data.session.device}
                        </UI.Label>
                        <UI.Label variantColor="blue" size="sm" fontSize="0.6rem">
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
    </>
  );
};
