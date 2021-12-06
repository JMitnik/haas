import { inputObjectType, mutationField, objectType, queryField } from '@nexus/schema';
import { AutomationType } from './AutomationType'
import { AutomationEventType } from './AutomationEventType';
import { AutomationConditionScopeType } from './AutomationConditionScopeType';
import { AutomationConditionOperatorType } from './AutomationConditionOperatorType';
import { MatchValueType } from './MatchValueType';
import { QuestionAspectType } from './QuestionAspectType';
import { DialogueAspectType } from './DialogueAspectType';
import { WorkspaceAspectType } from './WorkspaceAspectType';
import { ConditionPropertyAggregateType } from './ConditionPropertyAggregateType';
import { AutomationActionType } from './AutomationActionType';
import { AutomationModel } from './AutomationModel';
import { UserInputError } from 'apollo-server-express';
import { CreateAutomationInput } from '../AutomationPrismaAdapter';
import { isPresent } from 'ts-is-present';

export const MatchValueInput = inputObjectType({
  name: 'MatchValueInput',
  definition(t) {
    t.field('matchValueType', { type: MatchValueType });
    t.string('textValue', { nullable: true });
    t.int('numberValue', { nullable: true });
    t.string('dateTimeValue', { nullable: true });
  },
});

export const ConditionPropertyAggregateInput = inputObjectType({
  name: 'ConditionPropertyAggregateInput',
  definition(t) {
    t.string('startDate', { nullable: true });
    t.string('endDate', { nullable: true });
    t.int('latest', { nullable: true });

    t.field('type', { type: ConditionPropertyAggregateType });
  },
});

export const ConditionQuestionScopeInput = inputObjectType({
  name: 'ConditionQuestionScopeInput',
  definition(t) {
    t.field('aspect', { type: QuestionAspectType });
    t.field('aggregate', { type: ConditionPropertyAggregateInput });
  },
});

export const ConditionDialogueScopeInput = inputObjectType({
  name: 'ConditionDialogueScopeInput',
  definition(t) {
    t.field('aspect', { type: DialogueAspectType });
    t.field('aggregate', { type: ConditionPropertyAggregateInput });
  },
});

export const ConditionWorkspaceScopeInput = inputObjectType({
  name: 'ConditionWorkspaceScopeInput',
  definition(t) {
    t.field('aspect', { type: WorkspaceAspectType });
    t.field('aggregate', { type: ConditionPropertyAggregateInput });
  },
});

export const ConditionScopeInput = inputObjectType({
  name: 'ConditionScopeInput',
  definition(t) {
    t.field('type', { type: AutomationConditionScopeType });
    t.field('questionScope', { type: ConditionQuestionScopeInput, nullable: true });
    t.field('dialogueScope', { type: ConditionDialogueScopeInput, nullable: true });
    t.field('workspaceScope', { type: ConditionWorkspaceScopeInput, nullable: true });
  }
})

export const CreateAutomationCondition = inputObjectType({
  name: 'CreateAutomationCondition',
  definition(t) {
    t.field('scope', { type: ConditionScopeInput });
    t.field('operator', { type: AutomationConditionOperatorType });
    t.field('matchValue', { type: MatchValueInput });

    t.string('questionId', { nullable: true });
    t.string('dialogueId', { nullable: true });
    t.string('workspaceId', { nullable: true });
  }
});

export const AutomationActionInput = inputObjectType({
  name: 'AutomationActionInput',
  definition(t) {
    t.field('type', { type: AutomationActionType });
  },
});

export const AutomationEventInput = inputObjectType({
  name: 'AutomationEventInput',
  definition(t) {
    t.field('eventType', { type: AutomationEventType });
    t.string('questionId', { nullable: true });
    t.string('dialogueId', { nullable: true });
  }
})

export const CreateAutomationResolverInput = inputObjectType({
  name: 'CreateAutomationResolverInput',
  definition(t) {
    // Generic info
    t.string('label');
    t.string('description', { nullable: true });
    t.string('workspaceId');

    // Type of automation (e.g. Trigger, Campaign etc.)
    t.field('automationType', { type: AutomationType });

    // Trigger: event related fields
    t.field('event', { type: AutomationEventInput });

    // Trigger: condition related fields
    t.list.field('conditions', { type: CreateAutomationCondition });

    // Automation Actions
    t.list.field('actions', { type: AutomationActionInput });

    // Trigger: 
    // TODO: Add fields for Trigger:recurring as wel as Campaign
  },
});

export const CreateAutomationResolver = mutationField('createAutomation', {
  type: AutomationModel,
  args: { input: CreateAutomationResolverInput },
  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('No input provided create automation with!');
    if (!args.input.label || typeof args.input.label === undefined || args.input.label === null) throw new UserInputError('No label provided for automation!');
    if (!args.input.automationType) throw new UserInputError('No automation type provided for automation!');
    if (!args.input.workspaceId) throw new UserInputError('No workspace Id provided for automation!');

    // Event input
    if (!args.input.event) throw new UserInputError('No event provided for automation!');
    if (!args.input.event.eventType) throw new UserInputError('No event type provided for automation event!');

    if (args.input?.conditions?.length === 0) throw new UserInputError('No conditions provided for automation!');
    if (args.input?.actions?.length === 0) throw new UserInputError('No actions provided for automation!');

    const automation = await ctx.services.automationService.createAutomation(args.input);
    console.log('CREATED AUTOMATION: ', automation);
    return automation as any;
  },
});