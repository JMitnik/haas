import { inputObjectType, mutationField, objectType, queryField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';
import { AutomationModel } from './AutomationModel';

export const GetAutomationsByWorkspaceInput = inputObjectType({
  name: 'GetAutomationsByWorkspaceInput',
  definition(t) {
    t.string('workspaceId');
  },
});

export const GetAutomationsByWorkspace = objectType({
  name: 'GetAutomationsByWorkspace',
  definition(t) {
    t.list.field('automations', {
      type: AutomationModel,
    });
  }
})

export const GetAutomationsByWorkspaceQuery = queryField('getAutomationsByWorkspace', {
  type: GetAutomationsByWorkspace,
  args: { where: GetAutomationsByWorkspaceInput },
  async resolve(parent, args, ctx) {
    if (!args?.where?.workspaceId) throw new UserInputError('No workspaceId provided to find automations with!');

    // TODO: include all necessary relations (at the moment it is just a 'bare' automation object)
    return { automations: ctx.services.automationService.findAutomationsByWorkspace(args.where.workspaceId) } as any;
  }
})