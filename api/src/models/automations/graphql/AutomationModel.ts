import { inputObjectType, objectType, queryField } from '@nexus/schema';
import { AutomationType } from './AutomationType';
import { AutomationTriggerModel } from './AutomationTrigger'
import { CustomerType } from '../../customer/index'
import { UserInputError } from 'apollo-server-express';

export const AutomationModel = objectType({
  name: 'AutomationModel',
  description: 'Automation',

  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');
    t.boolean('isActive');
    t.string('label');

    t.string('description', { nullable: true })

    t.field('type', {
      type: AutomationType,
    });

    t.field('automationTrigger', {
      type: AutomationTriggerModel,
      nullable: true,
    });

    t.field('workspace', {
      type: CustomerType,
      nullable: true,
    });
  },
});

export const GetAutomationInput = inputObjectType({
  name: 'GetAutomationInput',
  definition(t) {
    t.string('id');
  },
})

export const GetAutomationQuery = queryField('automation', {
  type: AutomationModel,
  nullable: true,
  args: {
    where: GetAutomationInput,
  },
  async resolve(parent, args, ctx) {
    if (!args.where?.id) throw new UserInputError('No ID available to find automation with!');

    const automation = await ctx.services.automationService.findAutomationById(args.where.id);

    return automation as any;
  },
})