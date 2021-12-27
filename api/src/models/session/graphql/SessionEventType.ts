import { enumType } from '@nexus/schema';

export const SessionEventType = enumType({
  name: 'SessionEventType',
  description: 'Types of events that can be emitted in a user\'s session.',

  members: ['CHOICE_ACTION', 'SLIDER_ACTION', 'NAVIGATION', 'FORM_ACTION'],
});
