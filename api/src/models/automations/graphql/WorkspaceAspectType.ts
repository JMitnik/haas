import { enumType } from 'nexus';

export const WorkspaceAspectType = enumType({
  name: 'WorkspaceAspectType',
  members: [
    'NR_INTERACTIONS',
    'NR_VISITORS',
    'GENERAL_SCORE',
  ],
});