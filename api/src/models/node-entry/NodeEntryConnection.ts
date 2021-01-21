import { objectType } from "@nexus/schema";

export const NodeEntryConnectionType = objectType({
  name: 'NodeEntryConnectionType',
  definition(t) {
    t.int('count', { nullable: true });
    t.list.field('nodeEntries', { type: 'NodeEntry' });
  }
});