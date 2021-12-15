import { inputObjectType, mutationField } from '@nexus/schema';
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

export const MatchValueInput = inputObjectType({
  name: 'MatchValueInput',
  definition(t) {
    t.id('id', { nullable: true });
    t.field('matchValueType', { type: MatchValueType });
    t.string('textValue', { nullable: true });
    t.int('numberValue', { nullable: true });
    t.string('dateTimeValue', { nullable: true });
  },
});

export const ConditionPropertyAggregateInput = inputObjectType({
  name: 'ConditionPropertyAggregateInput',
  definition(t) {
    t.id('id', { nullable: true });
    t.string('startDate', { nullable: true });
    t.string('endDate', { nullable: true });
    t.int('latest', { nullable: true });

    t.field('type', { type: ConditionPropertyAggregateType });
  },
});

export const ConditionQuestionScopeInput = inputObjectType({
  name: 'ConditionQuestionScopeInput',
  definition(t) {
    t.id('id', { nullable: true });
    t.field('aspect', { type: QuestionAspectType });
    t.field('aggregate', { type: ConditionPropertyAggregateInput });
  },
});

export const ConditionDialogueScopeInput = inputObjectType({
  name: 'ConditionDialogueScopeInput',
  definition(t) {
    t.id('id', { nullable: true });
    t.field('aspect', { type: DialogueAspectType });
    t.field('aggregate', { type: ConditionPropertyAggregateInput });
  },
});

export const ConditionWorkspaceScopeInput = inputObjectType({
  name: 'ConditionWorkspaceScopeInput',
  definition(t) {
    t.id('id', { nullable: true });
    t.field('aspect', { type: WorkspaceAspectType });
    t.field('aggregate', { type: ConditionPropertyAggregateInput });
  },
});

export const ConditionScopeInput = inputObjectType({
  name: 'ConditionScopeInput',
  definition(t) {
    t.id('id', { nullable: true });
    t.field('type', { type: AutomationConditionScopeType });
    t.field('questionScope', { type: ConditionQuestionScopeInput, nullable: true });
    t.field('dialogueScope', { type: ConditionDialogueScopeInput, nullable: true });
    t.field('workspaceScope', { type: ConditionWorkspaceScopeInput, nullable: true });
  }
})

export const CreateAutomationCondition = inputObjectType({
  name: 'CreateAutomationCondition',
  definition(t) {
    t.id('id', { nullable: true });
    t.field('scope', { type: ConditionScopeInput });
    t.field('operator', { type: AutomationConditionOperatorType });
    t.list.field('matchValues', { type: MatchValueInput });

    t.string('questionId', { nullable: true });
    t.string('dialogueId', { nullable: true });
    t.string('workspaceId', { nullable: true });
  }
});

export const AutomationActionInput = inputObjectType({
  name: 'AutomationActionInput',
  definition(t) {
    t.id('id', { nullable: true });
    t.field('type', { type: AutomationActionType });
    t.string('apiKey');
    t.string('endpoint');
    t.json('payload');
  },
});

export const AutomationEventInput = inputObjectType({
  name: 'AutomationEventInput',
  definition(t) {
    t.id('id', { nullable: true });
    t.field('eventType', { type: AutomationEventType });
    t.string('questionId', { nullable: true });
    t.string('dialogueId', { nullable: true });
  }
})

export const CreateAutomationResolverInput = inputObjectType({
  name: 'CreateAutomationResolverInput',
  definition(t) {
    // Generic info
    t.id('id', { nullable: true });
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

    if (!args.input) throw new UserInputError('No input object provided for createAutomation Resolver');

    const automation = await ctx.services.automationService.createAutomation(args.input);
    return automation;
  },
});