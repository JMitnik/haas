import { inputObjectType, queryField } from 'nexus';
import { GraphQLYogaError } from '@graphql-yoga/node';
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
    if (!args?.where?.workspaceId) throw new GraphQLYogaError('No workspaceId provided to find automations with!');

    return ctx.services.automationService.findAutomationsByWorkspace(args.where.workspaceId);
  },
})
