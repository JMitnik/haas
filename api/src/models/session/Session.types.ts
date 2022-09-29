import { Prisma, Session } from 'prisma/prisma-client';
import { NexusGenEnums, NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';

import { NodeEntryWithTypes } from '../node-entry/NodeEntryServiceType';

const session = Prisma.validator<Prisma.SessionArgs>()({
  include: {
    nodeEntries: {
      include: {
        choiceNodeEntry: true,
        linkNodeEntry: true,
        registrationNodeEntry: true,
        textboxNodeEntry: true,
        relatedNode: {
          include: { options: true },
        },
        formNodeEntry: { include: { values: true } },
        videoNodeEntry: true,
        sliderNodeEntry: true,
      },
    },
  },
})

export type SessionWithNodeEntries = Prisma.SessionGetPayload<typeof session>;

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
