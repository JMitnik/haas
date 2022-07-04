import { Session } from '@prisma/client';
import { NexusGenEnums, NexusGenInputs } from '../../generated/nexus';

import { NodeEntryWithTypes } from '../node-entry/NodeEntryServiceType';

export interface SessionWithEntries extends Session {
  nodeEntries: NodeEntryWithTypes[];
}

export type SessionActionType = NexusGenEnums['SessionActionType'];

export interface SessionConnectionFilterInput {
  campaignVariantId?: string | null; // String
  deliveryType?: NexusGenEnums['SessionDeliveryType'] | null; // SessionDeliveryType
  endDate?: Date | null;
  offset?: number | null; // Int
  orderBy?: NexusGenInputs['SessionConnectionOrderByInput'] | null; // SessionConnectionOrderByInput
  perPage?: number | null; // Int
  scoreRange?: NexusGenInputs['SessionScoreRangeFilter'] | null; // SessionScoreRangeFilter
  search?: string | null; // String
  startDate?: Date | null;
  dialogueIds?: string[] | null;
}