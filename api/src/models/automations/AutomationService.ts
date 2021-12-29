import {
  AutomationConditionOperatorType,
  AutomationConditionScopeType,
  MatchValueType,
  NodeType,
  PrismaClient,
  QuestionAspect,
} from '@prisma/client';
import { UserInputError } from 'apollo-server-express';
import { isPresent } from 'ts-is-present';

import { NexusGenInputs } from '../../generated/nexus';
import { offsetPaginate } from '../general/PaginationHelpers';
import DialogueService from '../questionnaire/DialogueService';
import { AutomationPrismaAdapter } from './AutomationPrismaAdapter';
import {
  AutomationCondition,
  AutomationTrigger,
  CreateAutomationConditionScopeInput,
  CreateAutomationInput,
  CreateConditionMatchValueInput,
  SetupQuestionCompareDataInput,
  SetupQuestionCompareDataOutput,
  UpdateAutomationInput
} from './AutomationTypes'

class AutomationService {
  automationPrismaAdapter: AutomationPrismaAdapter;
  dialogueService: DialogueService;

  constructor(prisma: PrismaClient) {
    this.automationPrismaAdapter = new AutomationPrismaAdapter(prisma);
    this.dialogueService = new DialogueService(prisma);
  }

  /**
   * Sets up the data necessary for comparing slider data with the condition match value
   * @param input object containing
   * @returns an object containing the value to be compared, the match value it should be checked against and total entries
   */
  setupSliderCompareData = async (input: SetupQuestionCompareDataInput): Promise<SetupQuestionCompareDataOutput | undefined> => {
    const { questionId, aspect, aggregate, matchValues } = input;
    const scopedSliderNodeEntries = await this.automationPrismaAdapter.aggregateScopedSliderNodeEntries(
      questionId,
      aspect,
      aggregate
    );
    const aggregatedAverageValue = scopedSliderNodeEntries.aggregatedValues._avg?.value;
    const matchValue = matchValues?.[0]?.numberValue;

    return {
      compareValue: aggregatedAverageValue,
      matchValue: matchValue,
      totalEntries: scopedSliderNodeEntries.totalEntries,
    }
  }

  /**
  * Sets up the data necessary for comparing choice data with the condition match value
  * @param input object containing
  * @returns an object containing the value to be compared, the match value it should be checked against and total entries
  */
  setupChoiceCompareData = async (input: SetupQuestionCompareDataInput): Promise<SetupQuestionCompareDataOutput | undefined> => {
    let compareValue: number | null;
    const { questionId, aspect, aggregate, matchValues } = input;
    const scopedChoiceNodeEntries = await this.automationPrismaAdapter.aggregateScopedChoiceNodeEntries(questionId, aspect, aggregate);
    const amountMatchValue = matchValues.find((matchValue) => matchValue.type === MatchValueType.INT);
    const textMatchValue = matchValues.find((matchValue) => matchValue.type === MatchValueType.STRING)?.textValue;

    compareValue = textMatchValue && Object.keys(scopedChoiceNodeEntries.aggregatedValues).find((key) => key === textMatchValue) ? scopedChoiceNodeEntries.aggregatedValues[textMatchValue] : 0;

    return {
      // if matchValue doesn't exist that's a condition problem -> returning null.
      // if key doesn't exist in scopedChoiceNodeEntries.aggregatedValues -> returning 0.
      compareValue: textMatchValue ? compareValue : null,
      matchValue: amountMatchValue?.numberValue,
      totalEntries: scopedChoiceNodeEntries.totalEntries,
    }
  }

  /**
  * Sets up the data necessary for comparing question data with the condition match value
  * @param input object containing
  * @returns an object containing the value to be compared, the match value it should be checked against and total entries
  */
  setupQuestionCompareData = async (input: SetupQuestionCompareDataInput): Promise<SetupQuestionCompareDataOutput | undefined> => {
    switch (input.type) {
      case NodeType.SLIDER: {
        return this.setupSliderCompareData(input);
      }

      case NodeType.CHOICE: {
        return this.setupChoiceCompareData(input);
      }

      default: {
        return undefined;
      }
    }
  };

  /**
   * Validates question condition scope.
   *
   * NOTE:
   * - CURRENTLY ONLY SUPPORT SLIDER NODES
   * @param condition
   */
  validateQuestionScopeCondition = async (condition: AutomationCondition) => {
    const input: SetupQuestionCompareDataInput = {
      type: condition.question?.type as NodeType,
      questionId: condition?.question?.id as string,
      matchValues: condition.matchValues,
      aggregate: condition.questionScope?.aggregate,
      aspect: condition.questionScope?.aspect as QuestionAspect,
    };
    // Fetch data based on scope
    const scopedData = await this.setupQuestionCompareData(input);

    // Some of the data necessary to validate condition is missing
    if (!scopedData || (!scopedData?.compareValue && typeof scopedData?.compareValue !== 'number') || !scopedData?.matchValue) {
      return false;
    }

    // Want latest X but there is less than X *new* entries in the database => return false
    if (condition.questionScope?.aggregate?.latest && scopedData.totalEntries % condition.questionScope?.aggregate?.latest !== 0) {
      return false;
    }

    if (condition.operator === AutomationConditionOperatorType.SMALLER_OR_EQUAL_THAN) {
      return scopedData.compareValue <= scopedData.matchValue;
    }
  }

  /**
   * Checks conditions of a potentially triggered automation
   * @param automationTriggers a list of potentially triggered automations
   * @returns boolean whether all conditions of an automation trigger pass
   */
  checkAutomationTriggersConditions = async (automationTrigger: AutomationTrigger) => {
    const matchedConditionsTriggers = await Promise.all(automationTrigger.conditions.map(async (condition) => {
      switch (condition.scope) {
        case AutomationConditionScopeType.QUESTION: {
          return this.validateQuestionScopeCondition(condition);
        }

        case AutomationConditionScopeType.DIALOGUE: {
          return false;
        }

        case AutomationConditionScopeType.WORKSPACE: {
          return false;
        }

        default: {
          return false;
        }
      }
    }));

    const passedConditions = !matchedConditionsTriggers.includes(false);
    return passedConditions;
  }

  /**
   * Checks whether any candidate trigger automations with an event related to a dialogue (or its questions).
   * @param dialogueId a dialogue id
   * @returns a list of automation triggers potentially triggered
   */
  getCandidateTriggers = async (dialogueId: string) => {
    const questions = await this.dialogueService.getQuestionsByDialogueId(dialogueId);
    const questionIds = questions.map((question) => question.id).filter(isPresent);
    const candidateAutomations = await this.automationPrismaAdapter.findCandidateAutomations(
      dialogueId,
      questionIds
    );

    if (!candidateAutomations.length) return null;

    const candidateAutomationTriggers = candidateAutomations.map(
      (automation) => automation.automationTrigger
    ).filter(isPresent);

    return candidateAutomationTriggers;
  }

  /**
   * Checks for a dialogue whether it has any triggered automations, and if so run corresponding actions.
   * @param dialogueId
   */
  handleTriggerAutomations = async (dialogueId: string) => {
    const candidateAutomations = await this.getCandidateTriggers(dialogueId);
    if (!candidateAutomations) {
      console.log('No potential trigger automations found. abort');
      return;
    }

    console.log('Candidate automations: ', candidateAutomations);

    const triggeredAutomations = await Promise.all(candidateAutomations.map(async (automationTrigger) => {
      // TODO: Consider ANDS vs ORs for conditions
      const allConditionsConfirmed = await this.checkAutomationTriggersConditions(automationTrigger);
      if (allConditionsConfirmed) {
        console.log('All conditions of automation trigger confirmed. Do action');
      } else {
        console.log('One or more conditions have failed. No action done');
      }
    }));
  }

  /**
   * Validates the condition scope input object provided by checking the existence of fields which could be potentially be undefined or null
   * @param condition input object for an AutomationConditionScope
   * @returns a validated AutomationConditionScope input object where it is sure specific fields exist
   * @throws UserInputError if not all information is required
   */
  validateCreateAutomationConditionScopeInput = (condition: NexusGenInputs['CreateAutomationCondition']): Required<NexusGenInputs['CreateAutomationCondition']> => {
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

    return condition as Required<NexusGenInputs['CreateAutomationCondition']>;
  }

  /**
   * Constructs a CREATE prisma condition scope data object
   * @param condition input object for an AutomationConditionScope
   * @returns a CREATE prisma condition scope data object
   */
  constructCreateAutomationConditionScopeInput = (condition: NexusGenInputs['CreateAutomationCondition']): CreateAutomationConditionScopeInput => {
    const validatedCondition = this.validateCreateAutomationConditionScopeInput(condition);

    return {
      ...validatedCondition.scope,
      type: validatedCondition.scope?.type,
    } as CreateAutomationConditionScopeInput;
  }

  hasEmptyTargetList = (payload: any): boolean => {
    if (!payload) return true;
    const targetsProperty = Object.entries(payload).find((entry) => entry[0] === 'targets') as [string, Array<string>] | undefined;
    return targetsProperty ? targetsProperty[1].length === 0 : true;
  }

  /**
   * Validates data input for automation actions
   * @param input
   * @returns validated CREATE prisma automation actions data list
   */
  validateAutomationActionsInput = (input: NexusGenInputs['CreateAutomationResolverInput']): CreateAutomationInput['actions'] => {
    if (input?.actions?.length === 0) throw new UserInputError('No actions provided for automation!');
    input.actions?.forEach((action) => {
      if (!action.type) throw new UserInputError('No action type provided for one of the automation actions!');
      // TODO: Construct type for both email, sms and all other action types to check against

      const noTargetList = action.payload ? (Object.entries(action.payload).length === 0
        || !Object.keys(action.payload).find((key) => key === 'targets')
        || this.hasEmptyTargetList(action.payload)) : true;

      if (action.type === 'SEND_EMAIL') {
        if (noTargetList) throw new UserInputError('No target email addresses provided for "SEND_EMAIL"!');
        // TODO: Add additional checks such as whether all properties exist for every target entry
      }

      if (action.type === 'SEND_SMS') {
        if (noTargetList) throw new UserInputError('No target phone numbers provided for "SEND_SMS"!');
        // TODO: Add additional checks such as whether all properties exist for every target entry
      }
    });

    return input.actions as CreateAutomationInput['actions'];
  }

  /**
   * Validates the AutomationAction input list provided by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing a list with AutomationAction input entries
   * @returns a validated AutomationAction input list where it is sure specific fields exist for all entries
   * @throws UserInputError if not all information is required
   */
  constructAutomationActionsInput = (input: NexusGenInputs['CreateAutomationResolverInput']): CreateAutomationInput['actions'] => {
    const validatedActions = this.validateAutomationActionsInput(input);
    return validatedActions;
  }

  validateCreateAutomationConditionsInput = (input: NexusGenInputs['CreateAutomationResolverInput']): Required<NexusGenInputs['CreateAutomationCondition'][]> => {
    if (input.conditions?.length === 0) throw new UserInputError('No conditions provided for automation');

    input.conditions?.forEach((condition) => {
      if (!condition.operator) {
        throw new UserInputError('No operator type is provided for a condition');
      }
      if (condition.matchValues?.length === 0) throw new UserInputError('No match values provided for an automation condition!');
      condition.matchValues?.forEach((matchValue) => {
        if (!matchValue.matchValueType) {
          throw new UserInputError('No match value type was provided for a condition!');
        }
      });
    });

    return input.conditions as Required<NexusGenInputs['CreateAutomationCondition'][]>;
  }

  /**
   * Validates the AutomationCondition input list provided by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing a list with AutomationCondition input entries
   * @returns a validated AutomationCondition input list where it is sure specific fields exist for all entries
   * @throws UserInputError if not all information is required
   */
  constructCreateAutomationConditionsInput = (input: NexusGenInputs['CreateAutomationResolverInput']): CreateAutomationInput['conditions'] => {
    const validatedConditions = this.validateCreateAutomationConditionsInput(input) as Required<NexusGenInputs['CreateAutomationCondition'][]>;

    const mappedConditions: CreateAutomationInput['conditions'] = validatedConditions?.map((condition) => {
      return {
        ...condition,
        operator: condition.operator as Required<AutomationConditionOperatorType>,
        scope: this.constructCreateAutomationConditionScopeInput(condition),
        matchValues: condition.matchValues?.map((matchValue) => {
          const { dateTimeValue, matchValueType, numberValue, textValue } = matchValue;

          return {
            dateTimeValue,
            numberValue,
            textValue,
            type: matchValueType,
          }
        }) as Required<CreateConditionMatchValueInput[]> || [],
      }
    }) || [];

    return mappedConditions;
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
    Validates the Automation input object for CREATING of an automation by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing all information needed to create an automation
   * @returns a validated Automation input object where it is sure specific fields exist for all entries
   * @throws UserInputError if not all information is required
   */
  validateCreateAutomationInput = (input: NexusGenInputs['CreateAutomationResolverInput']): CreateAutomationInput => {
    if (!input) throw new UserInputError('No input provided create automation with!');
    if (!input.label || typeof input.label === undefined || input.label === null) throw new UserInputError('No label provided for automation!');

    if (!input.automationType) throw new UserInputError('No automation type provided for automation!');
    if (!input.workspaceId) throw new UserInputError('No workspace Id provided for automation!');
    return input as Required<CreateAutomationInput>;
  }

  /**
   * Constructs the Automation prisma data object for CREATING of an automation by checking the existence of fields which could be potentially be undefined or null
   * @param input object containing all information needed to create an automation
   * @returns a validated Automation prisma data object
   * @throws UserInputError if not all information is required
   */
  constructCreateAutomationInput = (input: NexusGenInputs['CreateAutomationResolverInput']): CreateAutomationInput => {
    const validatedInput = this.validateCreateAutomationInput(input);

    const label: CreateAutomationInput['label'] = validatedInput.label;
    const workspaceId: CreateAutomationInput['workspaceId'] = validatedInput.workspaceId;
    const automationType: CreateAutomationInput['automationType'] = validatedInput.automationType;
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

  paginatedAutomations = async (
    workspaceSlug: string,
    filter?: NexusGenInputs['AutomationConnectionFilterInput'] | null,
  ) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const automations = await this.automationPrismaAdapter.findPaginatedAutomations(workspaceSlug, filter);
    const totalUsers = await this.automationPrismaAdapter.countAutomations(workspaceSlug, filter);

    const { totalPages, ...pageInfo } = offsetPaginate(totalUsers, offset, perPage);

    return {
      automations: automations,
      totalPages,
      pageInfo,
    };
  };

}

export default AutomationService;
