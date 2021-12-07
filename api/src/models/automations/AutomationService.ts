import { PrismaClient } from '@prisma/client';
import { UserInputError } from 'apollo-server-express';

import { NexusGenInputs } from '../../generated/nexus';
import { AutomationPrismaAdapter } from './AutomationPrismaAdapter';
import { CreateAutomationConditionScopeInput, CreateAutomationInput, UpdateAutomationInput } from './AutomationTypes'

class AutomationService {
  automationPrismaAdapter: AutomationPrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.automationPrismaAdapter = new AutomationPrismaAdapter(prisma);
  }

  constructCreateAutomationConditionScopeInput = (condition: NexusGenInputs['CreateAutomationCondition']): CreateAutomationConditionScopeInput => {
    if (!condition.scope) throw new UserInputError('One of the automation conditions has no scope object provided!');

    const { type, dialogueScope, workspaceScope, questionScope } = condition.scope;
    if (!type) throw new UserInputError('One of the automation conditions has no scope type provided!');
    if (type === 'QUESTION') {
      if (!questionScope?.aspect) {
        throw new UserInputError('Condition scope is question but no aspect is provided!');
      }
      if (!questionScope?.aggregate?.type) {
        throw new UserInputError('Condition scope is question but no aggregate type is provided!');
      }
    }
    if (type === 'DIALOGUE') {
      if (!dialogueScope?.aspect) throw new UserInputError('Condition scope is dialogue but no aspect is provided!');
      if (!dialogueScope?.aggregate?.type) throw new UserInputError('Condition scope is dialogue but no aggregate type is provided!');
    }
    if (type === 'WORKSPACE') {
      if (!workspaceScope?.aspect) throw new UserInputError('Condition scope is workspace but no aspect is provided!');
      if (!workspaceScope?.aggregate?.type) throw new UserInputError('Condition scope is workspace but no aggregate type is provided!');
    }

    return {
      ...condition.scope,
      type: type,
    } as CreateAutomationConditionScopeInput;
  }

  constructAutomationActionsInput = (input: NexusGenInputs['CreateAutomationResolverInput']): CreateAutomationInput['actions'] => {
    if (input?.actions?.length === 0) throw new UserInputError('No actions provided for automation!');

    const validatedActions: CreateAutomationInput['actions'] = input.actions?.map((action) => {
      if (!action.type) throw new UserInputError('No type available for one of the automation actions!');
      return {
        ...action,
        type: action.type,
      }
    }) || [];

    return validatedActions;
  }

  constructCreateAutomationConditionsInput = (input: NexusGenInputs['CreateAutomationResolverInput']): CreateAutomationInput['conditions'] => {
    if (input.conditions?.length === 0) throw new UserInputError('No conditions provided for automation');

    const validatedConditions: CreateAutomationInput['conditions'] = input.conditions?.map((condition) => {
      if (!condition.matchValue?.matchValueType
        || typeof condition.matchValue?.matchValueType === undefined
        || condition.matchValue?.matchValueType === null) {
        throw new UserInputError('One of the match values has no type provided!');
      }

      if (!condition.operator) {
        throw new UserInputError('No Operator input is provided for an AutomicCondition!');
      }

      const { dateTimeValue, matchValueType, numberValue, textValue } = condition.matchValue;

      return {
        ...condition,
        operator: condition.operator,
        scope: this.constructCreateAutomationConditionScopeInput(condition),
        matchValue: {
          dateTimeValue,
          numberValue,
          textValue,
          type: matchValueType,
        }
      }
    }) || [];

    return validatedConditions;
  }

  constructCreateAutomationEventInput = (input: NexusGenInputs['CreateAutomationResolverInput']): CreateAutomationInput['event'] => {
    if (!input.event) throw new UserInputError('No event provided for automation!');
    if (!input.event?.eventType || typeof input.event?.eventType === undefined || input.event?.eventType === null) throw new UserInputError('No event type provided for automation event!');
    return {
      ...input.event,
      eventType: input.event.eventType,
    }
  }

  constructCreateAutomationInput = (input: NexusGenInputs['CreateAutomationResolverInput']): CreateAutomationInput => {
    if (!input) throw new UserInputError('No input provided create automation with!');
    if (!input.label || typeof input.label === undefined || input.label === null) throw new UserInputError('No label provided for automation!');

    if (!input.automationType) throw new UserInputError('No automation type provided for automation!');
    if (!input.workspaceId) throw new UserInputError('No workspace Id provided for automation!');

    const label: CreateAutomationInput['label'] = input.label;
    const workspaceId: CreateAutomationInput['workspaceId'] = input.workspaceId;
    const automationType: CreateAutomationInput['automationType'] = input.automationType;
    const conditions: CreateAutomationInput['conditions'] = this.constructCreateAutomationConditionsInput(input);
    const event: CreateAutomationInput['event'] = this.constructCreateAutomationEventInput(input);
    const actions: CreateAutomationInput['actions'] = this.constructAutomationActionsInput(input);

    return { label, workspaceId, automationType, conditions, event, actions, description: input.description }
  }

  constructUpdateAutomationInput = (input: NexusGenInputs['CreateAutomationResolverInput']): UpdateAutomationInput => {
    if (!input.id) throw new UserInputError('No ID provided for automation that should be updated!');

    const id: UpdateAutomationInput['id'] = input.id;
    const createInput = this.constructCreateAutomationInput(input);
    return { ...createInput, id: id }
  }

  updateAutomation = (input: NexusGenInputs['CreateAutomationResolverInput']) => {
    // Test whether input data matches what's needed to update an automation
    const validatedInput = this.constructUpdateAutomationInput(input);
    return this.automationPrismaAdapter.updateAutomation(validatedInput);
  }

  createAutomation = (input: NexusGenInputs['CreateAutomationResolverInput']) => {
    // Test whether input data matches what's needed to create an automation
    const validatedInput = this.constructCreateAutomationInput(input);
    return this.automationPrismaAdapter.createAutomation(validatedInput);
  }

  findAutomationById = (automationId: string) => {
    return this.automationPrismaAdapter.findAutomationById(automationId);
  }

  findWorkspaceByAutomation = (automationId: string) => {
    return this.automationPrismaAdapter.findWorkspaceByAutomationId(automationId);
  };

  findAutomationsByWorkspace = (workspaceId: string) => {
    return this.automationPrismaAdapter.findAutomationsByWorkspaceId(workspaceId);
  };

}

export default AutomationService;
