import { enumType } from '@nexus/schema';

export const SessionActionType = enumType({
  name: 'SessionActionType',
  description: 'Types of actions that can be emitted in a user\'s session.',

  members: ['CHOICE_ACTION', 'SLIDER_ACTION', 'NAVIGATION', 'FORM_ACTION'],
});
