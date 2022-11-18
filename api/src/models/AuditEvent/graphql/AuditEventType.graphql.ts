import { enumType } from 'nexus';

export const AuditEventType = enumType({
  name: 'AuditEventType',
  members: ['ASSIGN_ACTION_REQUEST',
    'SEND_STALE_ACTION_REQUEST_REMINDER',
    'SET_ACTION_REQUEST_STATUS',
    'ACTION_REQUEST_CONFIRMED_COMPLETED',
    'ACTION_REQUEST_REJECTED_COMPLETED'],
})