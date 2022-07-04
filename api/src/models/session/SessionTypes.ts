import { Session } from '@prisma/client';
import { NexusGenEnums, NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';

import { NodeEntryWithTypes } from '../node-entry/NodeEntryServiceType';

export interface SessionWithEntries extends Session {
  nodeEntries: NodeEntryWithTypes[];
}

export type SessionActionType = NexusGenEnums['SessionActionType'];

export type SessionConnectionFilterInput = NexusGenInputs['SessionConnectionFilterInput'];

export type SessionConnection = NexusGenFieldTypes['SessionConnection'];
