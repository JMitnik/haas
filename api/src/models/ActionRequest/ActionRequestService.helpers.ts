import { orderBy } from 'lodash';
import { ActionRequestState, AuditEvent, AuditEventType } from 'prisma/prisma-client';

export const lasActionRequestAuditEventNeedsConfirm = (auditEvents: AuditEvent[]) => {
  const ordered = orderBy(auditEvents, (auditEvent) => auditEvent.createdAt, 'desc');

  if (!ordered?.[0]?.payload || ordered[0].type !== AuditEventType.SET_ACTION_REQUEST_STATUS) return false;

  return !!Object.values(ordered[0].payload).find((value) => value === ActionRequestState.COMPLETED);
};