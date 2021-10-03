import * as UI from '@haas/ui';
import { AlertCircle, Clock, Eye, Flag, HelpCircle, Mail, UserCheck } from 'react-feather';
import React from 'react';

import { Circle } from 'components/Common/Circle';
import { SessionFragmentFragment } from 'types/generated-types';
import { Timeline, TimelineItem } from 'components/Common/Timeline';
import { formatSimpleDate } from 'utils/dateUtils';

interface Interaction extends SessionFragmentFragment { }

interface InteractionTimelineProps {
  interaction: Interaction;
}

interface InteractionDescriptionProps {
  // eslint-disable-next-line react/no-unused-prop-types
  event: DeliveryEventFragmentFragment;
  // eslint-disable-next-line react/no-unused-prop-types
  delivery: Delivery;
}

const DeployedStatusDescription = ({ event }: InteractionDescriptionProps) => (
  <>
    <UI.SectionHeader>
      Delivery was deployed
    </UI.SectionHeader>
    {' '}
    Deployed on
    {' '}
    {formatSimpleDate(event.createdAt)}
  </>
);

const ScheduledStatusDescription = ({ delivery }: InteractionDescriptionProps) => (
  <>
    <UI.SectionHeader>
      Delivery was scheduled
    </UI.SectionHeader>
    {' '}
    Scheduled on
    {' '}
    {formatSimpleDate(delivery.scheduledAt)}
  </>
);

const FailedStatusDescription = ({ event }: InteractionDescriptionProps) => (
  <>
    <UI.SectionHeader>
      Delivery failed
    </UI.SectionHeader>
    {' '}
    Failed on
    {' '}
    {formatSimpleDate(event.createdAt)}

    <UI.Div mt={1}>
      {event.failureMessage && (
        <UI.ErrorPane
          header="Delivery failure"
          text={event.failureMessage}
        />
      )}
    </UI.Div>
  </>
);

const FinishedStatusDescription = ({ event }: InteractionDescriptionProps) => (
  <>
    <UI.SectionHeader>
      Interaction finished
    </UI.SectionHeader>
    {' '}
    on
    {' '}
    {formatSimpleDate(event.createdAt)}
  </>
);

const OpenedStatusDescription = ({ event }: InteractionDescriptionProps) => (
  <>
    <UI.SectionHeader>
      Dialogue opened
    </UI.SectionHeader>
    {' '}
    on
    {' '}
    {formatSimpleDate(event.createdAt)}
  </>
);

const SentStatusDescription = ({ event }: InteractionDescriptionProps) => (
  <>
    <UI.SectionHeader>
      Dialogue sent
    </UI.SectionHeader>
    {' '}
    on
    {' '}
    {formatSimpleDate(event.createdAt)}
  </>
);

const DeliveredStatusDescription = ({ event }: InteractionDescriptionProps) => (
  <>
    <UI.SectionHeader>
      Dialogue successfully delivered
    </UI.SectionHeader>
    {' '}
    on
    {' '}
    {formatSimpleDate(event.createdAt)}
  </>
);

const MapCampaignDescription: { [key in DeliveryStatusEnum]?: React.FC<InteractionDescriptionProps> } = {
  [DeliveryStatusEnum.Deployed]: DeployedStatusDescription,
  [DeliveryStatusEnum.Failed]: FailedStatusDescription,
  [DeliveryStatusEnum.Finished]: FinishedStatusDescription,
  [DeliveryStatusEnum.Opened]: OpenedStatusDescription,
  [DeliveryStatusEnum.Scheduled]: ScheduledStatusDescription,
  [DeliveryStatusEnum.Sent]: SentStatusDescription,
  [DeliveryStatusEnum.Delivered]: DeliveredStatusDescription,
};

const MapCampaignIcon: { [key in DeliveryStatusEnum]?: React.FC } = {
  [DeliveryStatusEnum.Deployed]: Mail,
  [DeliveryStatusEnum.Failed]: AlertCircle,
  [DeliveryStatusEnum.Finished]: Flag,
  [DeliveryStatusEnum.Opened]: Eye,
  [DeliveryStatusEnum.Scheduled]: Clock,
  [DeliveryStatusEnum.Sent]: Mail,
  [DeliveryStatusEnum.Delivered]: UserCheck,
};

const Icon = ({ deliveryType }: { deliveryType: DeliveryStatusEnum }) => {
  const CampaignIcon = MapCampaignIcon[deliveryType];

  if (!CampaignIcon) {
    return <HelpCircle />;
  }

  return <CampaignIcon />;
};

const StatusDescription = ({ event, delivery }: StatusDescriptionProps) => {
  const DeliveryStatusDescription = MapCampaignDescription[event.status];

  if (!DeliveryStatusDescription) {
    return <></>;
  }

  return <DeliveryStatusDescription event={event} delivery={delivery} />;
};

export const InteractionTimeline = ({ delivery }: CampaignTimelineProps) => (
  <Timeline enableFold isBlock nrItems={delivery.events?.length} brand="teal">
    {delivery.events?.map((event) => (
      <TimelineItem gridTemplateColumns="40px 1fr" key={event.id}>
        <Circle brand={event.status === DeliveryStatusEnum.Failed ? 'red' : 'teal'}>
          <UI.Icon>
            <Campaign deliveryType={event.status} />
          </UI.Icon>
        </Circle>
        <UI.Div>
          <StatusDescription event={event} delivery={delivery} />
        </UI.Div>
      </TimelineItem>
    ))}
  </Timeline>
);
