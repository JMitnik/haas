import { Session } from '@prisma/client';

import { NodeEntryWithTypes } from '../node-entry/NodeEntryService';

export interface SessionServiceType {
  getSessionById(sessionId: string): Promise<Session|null>;
}
export interface SessionWithEntries extends Session {
  nodeEntries: NodeEntryWithTypes[];
}
