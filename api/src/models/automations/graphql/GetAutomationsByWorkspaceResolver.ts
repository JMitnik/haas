import { inputObjectType, queryField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';
import { AutomationModel } from './AutomationModel';

export const GetAutomationsByWorkspaceInput = inputObjectType({
  name: 'GetAutomationsByWorkspaceInput',
  definition(t) {
    t.string('workspaceId');
  },
});

export const GetAutomationsByWorkspaceQuery = queryField('automations', {
  type: AutomationModel,
  list: true,
  args: { where: GetAutomationsByWorkspaceInput },
  async resolve(parent, args, ctx) {
    if (!args?.where?.workspaceId) throw new UserInputError('No workspaceId provided to find automations with!');

    return ctx.services.automationService.findAutomationsByWorkspace(args.where.workspaceId);
  }
})