import { inputObjectType, mutationField } from 'nexus';
import { AutomationType } from './AutomationType'
import { AutomationEventType } from './AutomationEventType';
import { AutomationConditionScopeType } from './AutomationConditionScopeType';
import { AutomationConditionOperatorType } from './AutomationConditionOperatorType';
import { OperandType } from './OperandType';
import { QuestionAspectType } from './QuestionAspectType';
import { DialogueAspectType } from './DialogueAspectType';
import { WorkspaceAspectType } from './WorkspaceAspectType';
import { ConditionPropertyAggregateType } from './ConditionPropertyAggregateType';
import { AutomationActionType } from './AutomationActionType';
import { AutomationModel } from './AutomationModel';
import { UserInputError } from 'apollo-server-express';
import { AutomationConditionBuilderType } from './AutomationConditionBuilderType';
import { RecurringPeriodType } from './RecurringPeriodType';

export const CreateAutomationOperandInput = inputObjectType({
  name: 'CreateAutomationOperandInput',
  definition(t) {
    t.id('id');
    t.field('operandType', { type: OperandType });
    t.string('textValue');
    t.int('numberValue');
    t.string('dateTimeValue');
  },
});

export const ConditionPropertyAggregateInput = inputObjectType({
  name: 'ConditionPropertyAggregateInput',
  definition(t) {
    t.id('id');
    t.string('startDate');
    t.string('endDate');
    t.int('latest');

    t.field('type', { type: ConditionPropertyAggregateType });
  },
});

export const ConditionQuestionScopeInput = inputObjectType({
  name: 'ConditionQuestionScopeInput',
  definition(t) {
    t.id('id');
    t.field('aspect', { type: QuestionAspectType });
    t.field('aggregate', { type: ConditionPropertyAggregateInput });
  },
});

export const ConditionDialogueScopeInput = inputObjectType({
  name: 'ConditionDialogueScopeInput',
  definition(t) {
    t.id('id');
    t.field('aspect', { type: DialogueAspectType });
    t.field('aggregate', { type: ConditionPropertyAggregateInput });
  },
});

export const ConditionWorkspaceScopeInput = inputObjectType({
  name: 'ConditionWorkspaceScopeInput',
  definition(t) {
    t.id('id');
    t.field('aspect', { type: WorkspaceAspectType });
    t.field('aggregate', { type: ConditionPropertyAggregateInput });
  },
});

export const ConditionScopeInput = inputObjectType({
  name: 'ConditionScopeInput',
  definition(t) {
    t.id('id');
    t.field('type', { type: AutomationConditionScopeType });
    t.field('questionScope', { type: ConditionQuestionScopeInput });
    t.field('dialogueScope', { type: ConditionDialogueScopeInput });
    t.field('workspaceScope', { type: ConditionWorkspaceScopeInput });
  },
})

export const CreateAutomationCondition = inputObjectType({
  name: 'CreateAutomationCondition',
  definition(t) {
    t.id('id');
    t.field('scope', { type: ConditionScopeInput });
    t.field('operator', { type: AutomationConditionOperatorType });

    t.list.field('operands', { type: CreateAutomationOperandInput });

    t.string('questionId');
    t.string('dialogueId');
    t.string('workspaceId');
  },
});

export const AutomationActionChannelInput = inputObjectType({
  name: 'AutomationActionChannelInput',
  definition(t) {
    t.id('id', { nullable: true });
    // TODO: Add other fields such as payload here later
  },
});

export const AutomationActionInput = inputObjectType({
  name: 'AutomationActionInput',
  definition(t) {
    t.id('id');
    t.field('type', { type: AutomationActionType });
    t.string('apiKey');
    t.string('endpoint');
    t.json('payload');
    t.list.field('channels', { type: AutomationActionChannelInput });
  },
});

export const AutomationEventInput = inputObjectType({
  name: 'AutomationEventInput',
  definition(t) {
    t.id('id');
    t.field('eventType', { type: AutomationEventType });
    t.string('questionId');
    t.string('dialogueId');
  },
});

export const AutomationConditionBuilderInput = inputObjectType({
  name: 'AutomationConditionBuilderInput',
  definition(t) {
    t.id('id');

    t.field('type', {
      type: AutomationConditionBuilderType,
    });

    t.list.field('conditions', {
      type: CreateAutomationCondition,
    });

    t.field('childConditionBuilder', {
      type: AutomationConditionBuilderInput,
    });
  },
});

export const AutomationScheduleInput = inputObjectType({
  name: 'AutomationScheduleInput',
  definition(t) {
    t.id('id', { nullable: true });
    t.field('type', { type: RecurringPeriodType, required: true });
    t.string('minutes', { required: true });
    t.string('hours', { required: true });
    t.string('dayOfMonth', { required: true });
    t.string('month', { required: true });
    t.string('dayOfWeek', { required: true });
    t.string('dialogueId', { nullable: true });
  },
})

export const CreateAutomationInput = inputObjectType({
  name: 'CreateAutomationInput',
  definition(t) {
    // Generic info
    t.id('id');
    t.string('label');
    t.string('description');
    t.string('workspaceId');

    // Type of automation (e.g. Trigger, Campaign etc.)
    t.field('automationType', { type: AutomationType });

    // Trigger: event related fields
    t.field('event', { type: AutomationEventInput });

    // Trigger: condition related fields
    t.field('conditionBuilder', { type: AutomationConditionBuilderInput });

    t.field('schedule', { type: AutomationScheduleInput, nullable: true });

    // Automation Actions
    t.list.field('actions', { type: AutomationActionInput });

    // TODO: Add fields Campaign
  },
});

export const CreateAutomationResolver = mutationField('createAutomation', {
  description: 'Creates a new automation.',
  type: AutomationModel,
  args: { input: CreateAutomationInput },

  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('No input object provided for createAutomation Resolver');

    const automation = await ctx.services.automationService.createAutomation(args.input);
    return automation as any;
  },
});
