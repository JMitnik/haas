import { Prisma, Session } from '@prisma/client';
import { NexusGenEnums, NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';

import { NodeEntryWithTypes } from '../node-entry/NodeEntryServiceType';

const dialogue = Prisma.validator<Prisma.DialogueArgs>()({
  include: {
    customer: true,
  },
});

export type DialogueWithCustomer = Prisma.DialogueGetPayload<typeof dialogue>;


export interface SessionWithEntries extends Session {
  nodeEntries: NodeEntryWithTypes[];
}

export type SessionActionType = NexusGenEnums['SessionActionType'];

export type SessionConnectionFilterInput = NexusGenInputs['SessionConnectionFilterInput'];

export type SessionConnection = NexusGenFieldTypes['SessionConnection'];

export type FollowUpAction = NexusGenFieldTypes['FormNodeEntryType'];
