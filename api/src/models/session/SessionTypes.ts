import { Session } from '@prisma/client';

import { NodeEntryWithTypes } from '../node-entry/NodeEntryService';

export interface SessionWithEntries extends Session {
  nodeEntries: NodeEntryWithTypes[];
}

export interface NodeEntryCount {
  [key: string]: number
};