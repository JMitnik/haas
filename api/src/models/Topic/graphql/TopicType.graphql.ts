import { enumType } from 'nexus';

export const TopicEnumType = enumType({
  name: 'TopicEnumType',
  description: 'All the different types a topic can be.',
  members: ['SYSTEM', 'WORKSPACE'],
});