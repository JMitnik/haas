import { enumType } from "@nexus/schema";

export const MatchValueType = enumType({
  name: 'MatchValueType',
  members: [
    'STRING',
    'INT',
    'DATE_TIME',
  ],
});