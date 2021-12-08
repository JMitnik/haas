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

  /**
   * Validates the condition scope input object provided by checking the existence of fields which could be potentially be undefined or null
   * @param condition input object for an AutomationConditionScope
   * @returns a validated AutomationConditionScope input object where it is sure specific fields exist
   * @throws UserInputError if not all information is required
   */
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

  /**
   * Validates the AutomationAction input list provided by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing a list with AutomationAction input entries
   * @returns a validated AutomationAction input list where it is sure specific fields exist for all entries
   * @throws UserInputError if not all information is required
   */
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

  /**
   * Validates the AutomationCondition input list provided by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing a list with AutomationCondition input entries
   * @returns a validated AutomationCondition input list where it is sure specific fields exist for all entries
   * @throws UserInputError if not all information is required
   */
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

  /**
   * Validates the AutomationEvent input object provided by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing a AutomationEvent input entry
   * @returns a validated AutomationEvent input object where it is sure specific fields exist for all entries
   * @throws UserInputError if not all information is required
   */
  constructCreateAutomationEventInput = (input: NexusGenInputs['CreateAutomationResolverInput']): CreateAutomationInput['event'] => {
    if (!input.event) throw new UserInputError('No event provided for automation!');
    if (!input.event?.eventType || typeof input.event?.eventType === undefined || input.event?.eventType === null) throw new UserInputError('No event type provided for automation event!');

    return {
      ...input.event,
      eventType: input.event.eventType,
    }
  }

  /**
   * Validates the Automation input object for CREATING of an automation by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing all information needed to create an automation
   * @returns a validated Automation input object where it is sure specific fields exist for all entries
   * @throws UserInputError if not all information is required
   */
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

  /**
   * Validates the Automation input object for UPDATING of an automation by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing all information needed to update an automation
   * @returns a validated Automation input object containing all information necessary to update an Automation
   * @throws UserInputError if not all information is required
   */
  constructUpdateAutomationInput = (input: NexusGenInputs['CreateAutomationResolverInput']): UpdateAutomationInput => {
    if (!input.id) throw new UserInputError('No ID provided for automation that should be updated!');

    const id: UpdateAutomationInput['id'] = input.id;
    const createInput = this.constructCreateAutomationInput(input);
    return { ...createInput, id: id }
  }

  /**
   * Updates an automation with the provided data after validating all
   * @param input object containing all information needed to update an automation
   * @returns updated Automation (without relationship fields)
   * @throws UserInputError if not all information is required
   */
  updateAutomation = (input: NexusGenInputs['CreateAutomationResolverInput']) => {
    // Test whether input data matches what's needed to update an automation
    const validatedInput = this.constructUpdateAutomationInput(input);
    return this.automationPrismaAdapter.updateAutomation(validatedInput);
  }

  /**
   * Creates an automation with the provided data after validating all
   * @param input object containing all information needed to create an automation
   * @returns created Automation (without relationship fields)
   * @throws UserInputError if not all information is required
   */
  createAutomation = (input: NexusGenInputs['CreateAutomationResolverInput']) => {
    // Test whether input data matches what's needed to create an automation
    const validatedInput = this.constructCreateAutomationInput(input);
    return this.automationPrismaAdapter.createAutomation(validatedInput);
  }

  /**
   * Finds an automation (and its relationships) by the provided ID
   * @param automationId the ID of the automation
   * @returns an Automation with relationships included or null if no automation with specified ID exist in the database 
   */
  findAutomationById = (automationId: string) => {
    return this.automationPrismaAdapter.findAutomationById(automationId);
  }

  /**
   * Finds the workspace an automation is part of by the provided automation ID
   * @param automationId the id of an automation
   * @returns a workspace
   */
  findWorkspaceByAutomation = (automationId: string) => {
    return this.automationPrismaAdapter.findWorkspaceByAutomationId(automationId);
  };

  /**
   * Finds all automations part of a workspace
   * @param workspaceId a workspace ID
   * @returns a list of automations part of a workspace
   */
  findAutomationsByWorkspace = (workspaceId: string) => {
    return this.automationPrismaAdapter.findAutomationsByWorkspaceId(workspaceId);
  };

}

export default AutomationService;
