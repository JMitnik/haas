import * as UI from '@haas/ui';
import React from 'react';

import { Circle } from 'components/Common/Circle';
import { NodeEntryFragmentFragment, QuestionNodeTypeEnum, SessionFragmentFragment } from 'types/generated-types';
import { QuestionNodeIcon } from 'components/Dialogue/QuestionNodeIcon';
import { Timeline, TimelineItem } from 'components/Common/Timeline';
import { formatSliderValue } from 'components/Dialogue/utils/formatSliderValue';

interface Interaction extends SessionFragmentFragment { }

interface InteractionTimelineProps {
  interaction: Interaction;
}

interface InteractionNodeEntryDescriptionProps {
  nodeEntry: NodeEntryFragmentFragment;
}

// const DeployedStatusDescription = ({ event }: InteractionDescriptionProps) => (
//   <>
//     <UI.SectionHeader>
//       Delivery was deployed
//     </UI.SectionHeader>
//     {' '}
//     Deployed on
//     {' '}
//     {formatSimpleDate(event.createdAt)}
//   </>
// );

// const ScheduledStatusDescription = ({ delivery }: InteractionDescriptionProps) => (
//   <>
//     <UI.SectionHeader>
//       Delivery was scheduled
//     </UI.SectionHeader>
//     {' '}
//     Scheduled on
//     {' '}
//     {formatSimpleDate(delivery.scheduledAt)}
//   </>
// );

// const FailedStatusDescription = ({ event }: InteractionDescriptionProps) => (
//   <>
//     <UI.SectionHeader>
//       Delivery failed
//     </UI.SectionHeader>
//     {' '}
//     Failed on
//     {' '}
//     {formatSimpleDate(event.createdAt)}

//     <UI.Div mt={1}>
//       {event.failureMessage && (
//         <UI.ErrorPane
//           header="Delivery failure"
//           text={event.failureMessage}
//         />
//       )}
//     </UI.Div>
//   </>
// );

// const FinishedStatusDescription = ({ event }: InteractionDescriptionProps) => (
//   <>
//     <UI.SectionHeader>
//       Interaction finished
//     </UI.SectionHeader>
//     {' '}
//     on
//     {' '}
//     {formatSimpleDate(event.createdAt)}
//   </>
// );

// const OpenedStatusDescription = ({ event }: InteractionDescriptionProps) => (
//   <>
//     <UI.SectionHeader>
//       Dialogue opened
//     </UI.SectionHeader>
//     {' '}
//     on
//     {' '}
//     {formatSimpleDate(event.createdAt)}
//   </>
// );

// const SentStatusDescription = ({ event }: InteractionDescriptionProps) => (
//   <>
//     <UI.SectionHeader>
//       Dialogue sent
//     </UI.SectionHeader>
//     {' '}
//     on
//     {' '}
//     {formatSimpleDate(event.createdAt)}
//   </>
// );

const TextboxNodeDescription = ({ nodeEntry }: InteractionNodeEntryDescriptionProps) => (
  <>
    {nodeEntry.value?.textboxNodeEntry ? (
      <>
        <UI.SectionHeader>
          User wrote the following down:
        </UI.SectionHeader>
        <UI.Div
          bg="white"
          borderRadius="10px"
          padding={2}
        >
          {nodeEntry.value?.textboxNodeEntry}
        </UI.Div>
        <UI.Span>
          when asked
          &quot;
          {nodeEntry.relatedNode?.title}
          &quot;
        </UI.Span>
      </>
    ) : (
      <>
        User left it empty
      </>
    )}
  </>
);

const MultiChoiceEntryDescription = ({ nodeEntry }: InteractionNodeEntryDescriptionProps) => (
  <>
    {nodeEntry.value?.choiceNodeEntry && (
      <>
        <UI.SectionHeader>
          User selected:
          &quot;
          {nodeEntry.value?.choiceNodeEntry}
          &quot;
        </UI.SectionHeader>
        <UI.Span>
          when asked
          &quot;
          {nodeEntry.relatedNode?.title}
          &quot;
        </UI.Span>
      </>
    )}
  </>
);

const VideoEmbedEntryDescription = ({ nodeEntry }: InteractionNodeEntryDescriptionProps) => (
  <>
    {nodeEntry.value?.videoNodeEntry && (
      <>
        <UI.SectionHeader>
          User made choice:
          {' '}
          {nodeEntry.value?.videoNodeEntry}
        </UI.SectionHeader>
        <UI.Span>
          when asked
          &quot;
          {nodeEntry.relatedNode?.title}
          &quot;
        </UI.Span>
      </>
    )}
  </>
);

const SliderEntryDescription = ({ nodeEntry }: InteractionNodeEntryDescriptionProps) => (
  <>
    {nodeEntry.value?.sliderNodeEntry && (
      <>
        <UI.SectionHeader>
          User slid the bunny to value:
          {' '}
          {formatSliderValue(nodeEntry.value?.sliderNodeEntry)}
        </UI.SectionHeader>
        <UI.Span>
          when asked
          &quot;
          {nodeEntry.relatedNode?.title}
          &quot;
        </UI.Span>
      </>
    )}
  </>
);

const MapCampaignDescription: { [key in QuestionNodeTypeEnum]?: React.FC<InteractionNodeEntryDescriptionProps> } = {
  [QuestionNodeTypeEnum.Slider]: SliderEntryDescription,
  [QuestionNodeTypeEnum.Choice]: MultiChoiceEntryDescription,
  [QuestionNodeTypeEnum.Textbox]: TextboxNodeDescription,
  [QuestionNodeTypeEnum.VideoEmbedded]: VideoEmbedEntryDescription,
  // [DeliveryStatusEnum.Failed]: FailedStatusDescription,
  // [DeliveryStatusEnum.Finished]: FinishedStatusDescription,
  // [DeliveryStatusEnum.Opened]: OpenedStatusDescription,
  // [DeliveryStatusEnum.Scheduled]: ScheduledStatusDescription,
  // [DeliveryStatusEnum.Sent]: SentStatusDescription,
  // [DeliveryStatusEnum.Delivered]: DeliveredStatusDescription,
};

const StatusDescription = ({ nodeEntry }: InteractionNodeEntryDescriptionProps) => {
  if (!nodeEntry.relatedNode?.type) return <></>;

  const MappedStatusDescription = MapCampaignDescription[nodeEntry.relatedNode?.type];

  if (!MappedStatusDescription) {
    return <></>;
  }

  return <MappedStatusDescription nodeEntry={nodeEntry} />;
};

export const InteractionTimeline = ({ interaction }: InteractionTimelineProps) => (
  <Timeline enableFold isBlock nrItems={interaction.nodeEntries?.length} brand="blue">
    {interaction.nodeEntries.map((nodeEntry) => (
      <TimelineItem gridTemplateColumns="40px 1fr" key={nodeEntry.id}>
        <Circle brand="blue">
          {nodeEntry.relatedNode?.type && (
            <UI.Icon color="white">
              <QuestionNodeIcon nodeType={nodeEntry.relatedNode.type} />
            </UI.Icon>
          )}
        </Circle>
        <UI.Div>
          <UI.Helper color="blue.400">{nodeEntry.relatedNode?.type}</UI.Helper>
          <StatusDescription nodeEntry={nodeEntry} />
        </UI.Div>
      </TimelineItem>
    ))}
  </Timeline>
);
