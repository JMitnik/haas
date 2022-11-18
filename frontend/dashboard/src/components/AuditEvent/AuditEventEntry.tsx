import * as UI from '@haas/ui';
import { AtSign } from 'react-feather';
import React from 'react';
import styled from 'styled-components';

import {
  AuditEventFragmentFragment,
  AuditEventType
} from 'types/generated-types';

/**
 * Wrap all general elements
 */
const GeneralWrappedTextContainer = styled.div`
  > * {
    width: 100%;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    height: auto;
    text-overflow: ellipsis;
    word-break: break-word;
  }
`;

const FormNodeEmailEntry = ({ auditEvent }: { auditEvent: AuditEventFragmentFragment }) => (
  <GeneralWrappedTextContainer>
    <UI.Label textTransform="none" variantColor="gray" bg="gray.300">
      <UI.Icon color="gray.500" mr={1}>
        <AtSign width="14px" height="14px" />
      </UI.Icon>
      {auditEvent.type}
    </UI.Label>
  </GeneralWrappedTextContainer>
);

const MapFormNodeEntryVal: { [key in AuditEventType]?: React.FC<{ auditEvent: any }> } = {
  [AuditEventType.ActionRequestConfirmedCompleted]: FormNodeEmailEntry,
  [AuditEventType.ActionRequestRejectedCompleted]: FormNodeEmailEntry,
  [AuditEventType.AssignActionRequest]: FormNodeEmailEntry,
  [AuditEventType.SendStaleActionRequestReminder]: FormNodeEmailEntry,
  [AuditEventType.SetActionRequestStatus]: FormNodeEmailEntry,
};

export const AuditEventEntry = ({ auditEvent }: { auditEvent: AuditEventFragmentFragment }) => {
  const FormNodeFieldEntry = MapFormNodeEntryVal[auditEvent.type];

  if (!FormNodeFieldEntry) return null;

  return (
    <UI.Card>
      <UI.CardBody>
        <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr', '1fr 1fr']}>
          <FormNodeFieldEntry auditEvent={auditEvent} />
        </UI.Grid>
      </UI.CardBody>
    </UI.Card>
  );
};

export default AuditEventEntry;
