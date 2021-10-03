import * as UI from '@haas/ui';
import { CampaignTimeline } from 'components/Campaign/CampaignTimeline';
import { Circle } from 'components/Common/Circle';
import { MessageCircle, ThumbsUp } from 'react-feather';
import { Timeline, TimelineItem } from 'components/Common/Timeline';
import React from 'react';
import styled, { css } from 'styled-components';

import { DeliveryEventFragmentFragment, DeliveryFragmentFragment, useGetInteractionQuery } from 'types/generated-types';

interface InteractionModalCardProps {
  sessionId: string;
  onClose: () => void;
}

interface Delivery extends DeliveryFragmentFragment {
  events: DeliveryEventFragmentFragment[];
}

interface InteractionDeliveryProps {
  delivery: Delivery;
}

export const InteractionModalCard = ({ onClose, sessionId }: InteractionModalCardProps) => {
  const { data, loading, error } = useGetInteractionQuery({
    variables: { sessionId },
  });

  if (loading) {
    return <UI.Loader />;
  }

  const delivery = data?.session?.delivery;
  const nodeEntries = data?.session?.nodeEntries;

  return (
    <UI.ModalCard maxWidth={1200} onClose={onClose}>
      <UI.ModalHead>
        <UI.ModalTitle>
          Session
        </UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        <Timeline>
          {/* TODO: Make into an accordion */}
          {!!delivery && (
            <TimelineItem gridTemplateColumns="40px 1fr">
              <Circle brand="teal">
                <MessageCircle />
              </Circle>
              <UI.Div>
                <UI.Div mb={2} color="teal.700">
                  <UI.SectionHeader>Dialogue deployed via delivery</UI.SectionHeader>
                  <UI.Button size="xs">See Delivery</UI.Button>
                </UI.Div>
                <CampaignTimeline delivery={delivery} />
              </UI.Div>
            </TimelineItem>
          )}
          <TimelineItem gridTemplateColumns="40px 1fr">
            <Circle brand="orange">
              <ThumbsUp />
            </Circle>
            <UI.Div mb={2} color="orange.700">
              <UI.SectionHeader>Dialogue interaction</UI.SectionHeader>
            </UI.Div>
          </TimelineItem>
        </Timeline>
      </UI.ModalBody>
    </UI.ModalCard>
  );
};
