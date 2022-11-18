import * as UI from '@haas/ui';
import { isPresent } from 'ts-is-present';
import React from 'react';
import styled from 'styled-components';

import {
  AuditEventFragmentFragment, AuditEventType, GetActionRequest
} from 'types/generated-types';
import { AuditEventIcon } from 'components/AuditEvent/AuditEventIcon';
import { Circle } from 'components/Common/Circle';
import { Timeline, TimelineItem } from 'components/Common/Timeline';

interface InteractionTimelineProps {
  actionRequest: GetActionRequest.GetActionRequest;
}

interface ActionRequestEntryDescriptionProps {
  auditEvent: AuditEventFragmentFragment;
}

const MultiChoiceEntryDescription = ({ auditEvent }: ActionRequestEntryDescriptionProps) => (
  <>
    {auditEvent && (
      <>
        <UI.Span>
          Event:
          {' '}
          {auditEvent.type}
        </UI.Span>
        <UI.SectionHeader>
          By User:
          {' '}
          {auditEvent.user?.email || 'N/A'}
        </UI.SectionHeader>
      </>
    )}
  </>
);

const MapCampaignDescription: { [key in AuditEventType]?: React.FC<ActionRequestEntryDescriptionProps> } = {
  [AuditEventType.ActionRequestConfirmedCompleted]: MultiChoiceEntryDescription,
  [AuditEventType.ActionRequestRejectedCompleted]: MultiChoiceEntryDescription,
  [AuditEventType.AssignActionRequest]: MultiChoiceEntryDescription,
  [AuditEventType.SendStaleActionRequestReminder]: MultiChoiceEntryDescription,
  [AuditEventType.SetActionRequestStatus]: MultiChoiceEntryDescription,
};

const StatusDescription = ({ auditEvent }: ActionRequestEntryDescriptionProps) => {
  const MappedStatusDescription = MapCampaignDescription[auditEvent.type];

  if (!MappedStatusDescription) {
    return <></>;
  }

  return <MappedStatusDescription auditEvent={auditEvent} />;
};

const InteractionTimelineContainer = styled.div`
  ${Circle} ${UI.Icon} svg {
    fill: currentColor;
  }
`;

export const ActionRequestTimeline = ({ actionRequest }: InteractionTimelineProps) => (
  <InteractionTimelineContainer>
    <Timeline enableFold isBlock nrItems={actionRequest.auditEvents?.length} brand="blue">
      {actionRequest?.auditEvents?.filter(isPresent).map((auditEvent) => (
        <TimelineItem gridTemplateColumns="40px 1fr" key={auditEvent.id}>
          <Circle brand="blue">
            <UI.Icon color="blue.50">
              <AuditEventIcon nodeType={auditEvent.type} />
            </UI.Icon>
          </Circle>
          <UI.Div>
            <UI.Helper color="blue.400">{auditEvent.type}</UI.Helper>

            <StatusDescription auditEvent={auditEvent} />
          </UI.Div>
        </TimelineItem>
      ))}
    </Timeline>
  </InteractionTimelineContainer>
);
