import * as UI from '@haas/ui';
import React from 'react';

import { Circle } from 'components/Common/Circle';
import { DeliveryEventFragmentFragment, DeliveryFragmentFragment, DeliveryStatusEnum } from 'types/generated-types';
import { Timeline, TimelineItem } from 'components/Common/Timeline';
import { formatSimpleDate } from 'utils/dateUtils';

import { CampaignIcon } from './CampaignIcon';

interface Delivery extends DeliveryFragmentFragment {
  events?: DeliveryEventFragmentFragment[] | null;
}

interface CampaignTimelineProps {
  delivery: Delivery;
}

interface StatusDescriptionProps {
  // eslint-disable-next-line react/no-unused-prop-types
  event: DeliveryEventFragmentFragment;
  // eslint-disable-next-line react/no-unused-prop-types
  delivery: Delivery;
}

const DeployedStatusDescription = ({ event }: StatusDescriptionProps) => (
  <>
    <UI.SectionHeader>
      Delivery was deployed
    </UI.SectionHeader>
    {' '}
    on
    {' '}
    {formatSimpleDate(event.createdAt)}
  </>
);

const ScheduledStatusDescription = ({ delivery }: StatusDescriptionProps) => (
  <>
    <UI.SectionHeader>
      Delivery was scheduled
    </UI.SectionHeader>
    {' '}
    for
    {' '}
    {formatSimpleDate(delivery.scheduledAt)}
  </>
);

const FailedStatusDescription = ({ event }: StatusDescriptionProps) => (
  <>
    <UI.SectionHeader>
      Delivery failed
    </UI.SectionHeader>
    {' '}
    on
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

const FinishedStatusDescription = ({ event }: StatusDescriptionProps) => (
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

const OpenedStatusDescription = ({ event }: StatusDescriptionProps) => (
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

const SentStatusDescription = ({ event }: StatusDescriptionProps) => (
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

const DeliveredStatusDescription = ({ event }: StatusDescriptionProps) => (
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

const MapCampaignDescription: { [key in DeliveryStatusEnum]?: React.FC<StatusDescriptionProps> } = {
  [DeliveryStatusEnum.Deployed]: DeployedStatusDescription,
  [DeliveryStatusEnum.Failed]: FailedStatusDescription,
  [DeliveryStatusEnum.Finished]: FinishedStatusDescription,
  [DeliveryStatusEnum.Opened]: OpenedStatusDescription,
  [DeliveryStatusEnum.Scheduled]: ScheduledStatusDescription,
  [DeliveryStatusEnum.Sent]: SentStatusDescription,
  [DeliveryStatusEnum.Delivered]: DeliveredStatusDescription,
};

const StatusDescription = ({ event, delivery }: StatusDescriptionProps) => {
  const DeliveryStatusDescription = MapCampaignDescription[event.status];

  if (!DeliveryStatusDescription) {
    return <></>;
  }

  return <DeliveryStatusDescription event={event} delivery={delivery} />;
};

export const CampaignTimeline = ({ delivery }: CampaignTimelineProps) => (
  <Timeline enableFold isBlock nrItems={delivery.events?.length} brand="teal">
    {delivery.events?.map((event) => (
      <TimelineItem gridTemplateColumns="40px 1fr" key={event.id}>
        <Circle brand={event.status === DeliveryStatusEnum.Failed ? 'red' : 'teal'}>
          <UI.Icon>
            <CampaignIcon deliveryType={event.status} />
          </UI.Icon>
        </Circle>
        <UI.Div>
          <StatusDescription event={event} delivery={delivery} />
        </UI.Div>
      </TimelineItem>
    ))}
  </Timeline>
);
