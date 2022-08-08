import { GraphQLYogaError } from '@graphql-yoga/node';
import { inputObjectType, mutationField } from 'nexus';

export const SendAutomationReportInput = inputObjectType({
  name: 'SendAutomationReportInput',
  definition(t) {
    t.string('workspaceSlug', { required: true });
    t.string('automationActionId', { required: true });
    t.string('reportUrl', { required: true });
  },
});

export const SendAutomationReportResolver = mutationField('sendAutomationReport', {
  type: 'Boolean',
  args: {
    input: SendAutomationReportInput,
  },
  nullable: true,
  async resolve(parent, args, ctx) {
    if (!args.input) throw new GraphQLYogaError('No input object provided for createAutomation Resolver');
    const { automationActionId, reportUrl, workspaceSlug } = args.input;

    return ctx.services.automationActionService.sendReport(automationActionId, workspaceSlug, reportUrl);
  },
});

export default [
  SendAutomationReportInput,
  SendAutomationReportResolver,
];
