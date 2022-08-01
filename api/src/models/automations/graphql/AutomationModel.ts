import { inputObjectType, objectType, queryField } from 'nexus';
import { AutomationType } from './AutomationType';
import { AutomationTriggerModel } from './AutomationTrigger'
import { CustomerType } from '../../customer/index'
import { GraphQLYogaError } from '@graphql-yoga/node';

export const AutomationModel = objectType({
  name: 'AutomationModel',
  description: 'Automation',

  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');
    t.boolean('isActive');
    t.string('label');

    t.string('description')

    t.field('type', {
      type: AutomationType,
    });

    t.field('automationTrigger', {
      type: AutomationTriggerModel,

    });

    t.field('workspace', {
      type: CustomerType,

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

  args: {
    where: GetAutomationInput,
  },
  async resolve(parent, args, ctx) {
    if (!args.where?.id) throw new GraphQLYogaError('No ID available to find automation with!');

    const automation = await ctx.services.automationService.findAutomationById(args.where.id);

    return automation as any;
  },
})
