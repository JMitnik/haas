import { enumType } from 'nexus';

export const DialogueAspectType = enumType({
  name: 'DialogueAspectType',
  members: [
    'NR_INTERACTIONS',
    'NR_VISITORS',
    'GENERAL_SCORE',
    'LATEST_SCORE',
  ],
});