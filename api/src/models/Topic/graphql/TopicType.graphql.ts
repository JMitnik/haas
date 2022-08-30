import { enumType } from 'nexus';

export const TopicType = enumType({
  name: 'TopicType',
  description: 'All the different types a topic can be.',
  members: ['SYSTEM', 'WORKSPACE'],
});