import { Prisma, Session } from '@prisma/client';

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

export interface TopicCount {
  score: number;
  topic: string;
  relatedTopics: string[];
  count: number;
  dialogueIds: string[];
}
