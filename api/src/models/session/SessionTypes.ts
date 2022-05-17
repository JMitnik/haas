import { Session } from '@prisma/client';

import { NodeEntryWithTypes } from '../node-entry/NodeEntryServiceType';

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
