import { Session } from '@prisma/client';
import { NexusGenEnums } from '../../generated/nexus';

import { NodeEntryWithTypes } from '../node-entry/NodeEntryServiceType';

export interface SessionWithEntries extends Session {
  nodeEntries: NodeEntryWithTypes[];
}

export type SessionActionType = NexusGenEnums['SessionActionType'];
