import { inputObjectType, objectType, queryField } from '@nexus/schema';
import { AutomationType } from './AutomationType';
import { AutomationTriggerModel } from './AutomationTrigger'
import { UserInputError } from 'apollo-server-express';

export const AutomationModel = objectType({
  name: 'AutomationModel',
  description: 'Automation',

  definition(t) {
    t.id('id');
    t.string('createdAt');
    t.string('updatedAt');
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
  },
});

export const GetAutomationInput = inputObjectType({
  name: 'GetAutomationInput',
  definition(t) {
    t.string('id');
  }
})

export const GetAutomationQuery = queryField('automation', {
  type: AutomationModel,
  nullable: true,
  args: {
    input: GetAutomationInput,
  },
  async resolve(parent, args, ctx) {
    if (!args.input?.id) throw new UserInputError('No ID available to find automation with!');

    const automation = await ctx.prisma.automation.findUnique({
      where: {
        id: args.input.id,
      },
      include: {
        automationTrigger: {
          include: {
            event: {
              include: {
                question: true,
                dialogue: true,
              }
            },
            conditions: {
              include: {
                questionScope: true,
                dialogueScope: true,
                matchValue: true,
                workspaceScope: true,
                dialogue: true,
                question: true,
              }
            },
            actions: true,
          },
        },
      },
    });

    console.log(automation?.automationTrigger.conditions[0]);

    return automation as any;
  }
})