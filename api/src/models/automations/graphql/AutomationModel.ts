import { objectType } from '@nexus/schema';
import { AutomationType } from './AutomationType';

export const AutomationModel = objectType({
  name: 'AutomationModel',
  description: 'Automation',

  definition(t) {
    t.id('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.boolean('isActive');

    t.field('type', {
      type: AutomationType,
    });
  }
})